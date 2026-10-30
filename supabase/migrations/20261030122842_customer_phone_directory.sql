-- Per-merchant phone identity and professional customer management.
begin;
create function private.normalize_phone(p_phone text) returns text
language plpgsql immutable set search_path='' as $$
declare v text; digits text;
begin
 v:=trim(p_phone);
 if v is null or length(v)>40 or v !~ '^[+0-9().[:space:]-]+$' or v ~ '.+\+' then raise exception 'INVALID_PHONE'; end if;
 digits:=regexp_replace(v,'[^0-9]','','g');
 if left(v,1)='+' then v:='+'||digits;
 elsif left(digits,2)='00' then v:='+'||substr(digits,3);
 elsif length(digits)=9 then v:='+34'||digits;
 elsif length(digits)=11 and left(digits,2)='34' then v:='+'||digits;
 else raise exception 'INVALID_PHONE'; end if;
 if v !~ '^\+[1-9][0-9]{7,14}$' then raise exception 'INVALID_PHONE'; end if;
 return v;
end; $$;
revoke all on function private.normalize_phone(text) from public,anon,authenticated;
alter table public.loyalty_customers add column profile_version integer not null default 1;
alter table public.loyalty_customers add column phone_verified_at timestamptz;
-- Auth is verification evidence, not a global customer record shared by businesses.
alter table public.loyalty_customers alter column user_id drop not null;
alter table public.loyalty_customers drop constraint loyalty_customers_merchant_id_user_id_key;
update public.loyalty_customers c set phone=private.normalize_phone(c.phone),
 phone_verified_at=(select case when nullif(u.phone,'') is not null and u.phone_confirmed_at is not null then
 case when private.normalize_phone(case when left(u.phone,1)='+' then u.phone else '+'||u.phone end)=private.normalize_phone(c.phone) then u.phone_confirmed_at end end
 from auth.users u where u.id=c.user_id);
alter table public.loyalty_customers add constraint loyalty_customers_merchant_phone_key unique(merchant_id,phone);
alter table public.loyalty_customers add constraint loyalty_customer_phone_format check(phone ~ '^\+[1-9][0-9]{7,14}$');

create or replace function private.enroll_loyalty(p_merchant uuid,p_name text,p_day integer,p_month integer) returns uuid
language plpgsql security definer set search_path='' as $$
declare v_phone text; v_verified timestamptz; v_id uuid;
begin
 if auth.uid() is null then raise exception 'NOT_AUTHORIZED'; end if;
 select phone,phone_confirmed_at into v_phone,v_verified from auth.users where id=auth.uid() and phone_confirmed_at is not null;
 if nullif(v_phone,'') is null then raise exception 'PHONE_NOT_VERIFIED'; end if;
 v_phone:=private.normalize_phone(case when left(v_phone,1)='+' then v_phone else '+'||v_phone end);
 if not exists(select 1 from public.merchants where id=p_merchant and active) then raise exception 'NOT_AVAILABLE'; end if;
 insert into public.loyalty_customers(merchant_id,user_id,name,phone,birthday_day,birthday_month,phone_verified_at)
 values(p_merchant,auth.uid(),trim(p_name),v_phone,p_day,p_month,v_verified)
 on conflict(merchant_id,phone) do nothing;
 -- Only the current, verified owner of this number can complete its enrollment.
 update public.loyalty_customers set user_id=auth.uid(),phone_verified_at=v_verified
 where merchant_id=p_merchant and phone=v_phone and active returning card_code into v_id;
 if v_id is null then raise exception 'NOT_AVAILABLE'; end if;
 return v_id;
end; $$;

create function private.customer_profile(p_merchant uuid,p_card uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or private.member_role(p_merchant) is null then raise exception 'NOT_AUTHORIZED'; end if;
 return (select jsonb_build_object('name',name,'phone',phone,'birthday_day',birthday_day,'birthday_month',birthday_month,
 'version',profile_version,'phone_verified',phone_verified_at is not null) from public.loyalty_customers
 where merchant_id=p_merchant and card_code=p_card and active);
end; $$;

create function private.search_loyalty_customers(p_merchant uuid,p_query text) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare q text:=trim(p_query); digits text;
begin
 if auth.uid() is null or private.member_role(p_merchant) is null then raise exception 'NOT_AUTHORIZED'; end if;
 if q is null or length(q)<2 then return '[]'::jsonb; end if;
 if length(q)>80 then raise exception 'INVALID_SEARCH'; end if;
 digits:=regexp_replace(q,'[^0-9]','','g');
 return (select coalesce(jsonb_agg(x),'[]'::jsonb) from (
 select c.card_code,c.name,c.phone from public.loyalty_customers c where c.merchant_id=p_merchant and c.active
 and (strpos(translate(lower(c.name),'áéíóúüñ','aeiouun'),translate(lower(q),'áéíóúüñ','aeiouun'))>0 or
 (length(digits)>=3 and strpos(c.phone,digits)>0)) order by lower(c.name),c.id limit 20) x);
end; $$;

create function private.update_loyalty_customer(p_merchant uuid,p_card uuid,p_name text,p_phone text,p_day integer,p_month integer,p_version integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare c public.loyalty_customers; v_phone text; fields text;
begin
 if auth.uid() is null or private.member_role(p_merchant) is null then raise exception 'NOT_AUTHORIZED'; end if;
 v_phone:=private.normalize_phone(p_phone);
 if p_name is null or length(trim(p_name)) not between 1 and 80 then raise exception 'INVALID_NAME'; end if;
 select * into c from public.loyalty_customers where merchant_id=p_merchant and card_code=p_card and active for update;
 if c.id is null then raise exception 'NOT_AVAILABLE'; end if;
 if p_version is null or p_version<>c.profile_version then raise exception 'PROFILE_CHANGED'; end if;
 if exists(select 1 from public.loyalty_customers where merchant_id=p_merchant and phone=v_phone and id<>c.id) then raise exception 'PHONE_IN_USE'; end if;
 fields:=concat_ws(',',case when c.name<>trim(p_name) then 'name' end,case when c.phone<>v_phone then 'phone' end,
 case when c.birthday_day is distinct from p_day or c.birthday_month is distinct from p_month then 'birthday' end);
 if fields='' then return private.customer_profile(p_merchant,p_card); end if;
 begin
  update public.loyalty_customers set name=trim(p_name),phone=v_phone,birthday_day=p_day,birthday_month=p_month,
   profile_version=profile_version+1,phone_verified_at=case when phone=v_phone then phone_verified_at else null end,
   user_id=case when phone=v_phone then user_id else null end where id=c.id;
 exception when unique_violation then raise exception 'PHONE_IN_USE';
 when check_violation then raise exception 'INVALID_BIRTHDAY'; end;
 -- No phone/name/birthday values in the audit log.
 insert into public.audit_events(merchant_id,actor_id,action) values(p_merchant,auth.uid(),'customer.update:'||c.id||':'||fields);
 return private.customer_profile(p_merchant,p_card);
end; $$;

-- Preserve the tested ledger projection, but remove all consumer access to it.
alter function private.loyalty_card(uuid,uuid) rename to loyalty_card_ledger;
revoke all on function private.loyalty_card_ledger(uuid,uuid) from public,anon,authenticated;
create function private.loyalty_card(p_merchant uuid,p_card uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare profile jsonb;
begin
 if auth.uid() is null or private.member_role(p_merchant) is null then raise exception 'NOT_AVAILABLE'; end if;
 profile:=private.customer_profile(p_merchant,p_card);
 if profile is null then raise exception 'NOT_AVAILABLE'; end if;
 return private.loyalty_card_ledger(p_merchant,p_card)||jsonb_build_object('profile',profile);
end; $$;
-- Rebind the wrapper to the new, professional-only projection.
create or replace function public.loyalty_card(p_merchant uuid,p_card uuid default null) returns jsonb
language sql stable security invoker set search_path='' as $$ select private.loyalty_card(p_merchant,p_card); $$;
create function public.search_loyalty_customers(p_merchant uuid,p_query text) returns jsonb
language sql stable security invoker set search_path='' as $$ select private.search_loyalty_customers(p_merchant,p_query); $$;
create function public.update_loyalty_customer(p_merchant uuid,p_card uuid,p_name text,p_phone text,p_day integer,p_month integer,p_version integer) returns jsonb
language sql security invoker set search_path='' as $$ select private.update_loyalty_customer(p_merchant,p_card,p_name,p_phone,p_day,p_month,p_version); $$;
revoke all on function private.customer_profile(uuid,uuid),private.search_loyalty_customers(uuid,text),private.update_loyalty_customer(uuid,uuid,text,text,integer,integer,integer),private.loyalty_card(uuid,uuid),
 public.search_loyalty_customers(uuid,text),public.update_loyalty_customer(uuid,uuid,text,text,integer,integer,integer) from public,anon,authenticated;
grant execute on function private.search_loyalty_customers(uuid,text),private.update_loyalty_customer(uuid,uuid,text,text,integer,integer,integer),private.loyalty_card(uuid,uuid),
 public.search_loyalty_customers(uuid,text),public.update_loyalty_customer(uuid,uuid,text,text,integer,integer,integer) to authenticated;
commit;
