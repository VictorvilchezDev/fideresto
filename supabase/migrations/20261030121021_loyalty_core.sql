-- Loyalty transactions. Only the bounded RPCs can modify these records.
begin;
create table public.loyalty_customers (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null references public.merchants(id),
 user_id uuid not null references auth.users(id), card_code uuid not null default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 80), phone text not null,
 birthday_day integer, birthday_month integer, active boolean not null default true,
 created_at timestamptz not null default now(), unique(merchant_id,user_id), unique(merchant_id,card_code), unique(merchant_id,id),
 check ((birthday_day is null and birthday_month is null) or
 (birthday_day is not null and birthday_month is not null and birthday_month between 1 and 12 and birthday_day between 1 and
 case birthday_month when 2 then 29 when 4 then 30 when 6 then 30 when 9 then 30 when 11 then 30 else 31 end))
);
create index loyalty_customers_user_idx on public.loyalty_customers(user_id);
create table public.loyalty_operations (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null, customer_id uuid not null,
 actor_id uuid not null references auth.users(id), request_key uuid not null,
 action text not null check(action in ('stamp','redeem','request','approve','reject')),
 payload jsonb not null, target_id uuid, reason text, reversed_by uuid references public.loyalty_operations(id),
 resolved_by uuid references public.loyalty_operations(id), created_at timestamptz not null default now(),
 unique(merchant_id,request_key), unique(merchant_id,customer_id,id),
 foreign key(merchant_id,customer_id) references public.loyalty_customers(merchant_id,id),
 foreign key(merchant_id,customer_id,target_id) references public.loyalty_operations(merchant_id,customer_id,id)
);
create index loyalty_operations_card_idx on public.loyalty_operations(merchant_id,customer_id,created_at desc);
create unique index loyalty_pending_request_idx on public.loyalty_operations(target_id) where action='request' and resolved_by is null;
create table public.loyalty_rewards (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null, customer_id uuid not null,
 reward_text text not null, stamp_target integer not null check(stamp_target between 1 and 100),
 issued_operation uuid not null, redeemed_operation uuid, voided_operation uuid,
 issued_at timestamptz not null default now(), expires_at timestamptz,
 unique(merchant_id,customer_id,id),
 foreign key(merchant_id,customer_id) references public.loyalty_customers(merchant_id,id),
 foreign key(merchant_id,customer_id,issued_operation) references public.loyalty_operations(merchant_id,customer_id,id),
 foreign key(merchant_id,customer_id,redeemed_operation) references public.loyalty_operations(merchant_id,customer_id,id),
 foreign key(merchant_id,customer_id,voided_operation) references public.loyalty_operations(merchant_id,customer_id,id)
);
create index loyalty_rewards_card_idx on public.loyalty_rewards(merchant_id,customer_id,issued_at desc);
create table public.loyalty_stamps (
 id uuid primary key default gen_random_uuid(), merchant_id uuid not null, customer_id uuid not null,
 operation_id uuid not null unique, reward_id uuid, voided_operation uuid, expires_at timestamptz,
 created_at timestamptz not null default now(),
 foreign key(merchant_id,customer_id) references public.loyalty_customers(merchant_id,id),
 foreign key(merchant_id,customer_id,operation_id) references public.loyalty_operations(merchant_id,customer_id,id),
 foreign key(merchant_id,customer_id,reward_id) references public.loyalty_rewards(merchant_id,customer_id,id),
 foreign key(merchant_id,customer_id,voided_operation) references public.loyalty_operations(merchant_id,customer_id,id)
);
create index loyalty_stamps_available_idx on public.loyalty_stamps(merchant_id,customer_id,created_at) where reward_id is null and voided_operation is null;
alter table public.loyalty_customers enable row level security;
alter table public.loyalty_operations enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.loyalty_stamps enable row level security;
-- Deliberately no direct table privileges/policies: no contact directory for staff,
-- and no way for browser clients to edit counters, identities or earned rewards.
revoke all on public.loyalty_customers,public.loyalty_operations,public.loyalty_rewards,public.loyalty_stamps from public,anon,authenticated;

create function private.enroll_loyalty(p_merchant uuid,p_name text,p_day integer,p_month integer) returns uuid
language plpgsql security definer set search_path='' as $$
declare v_phone text; v_id uuid;
begin
 if auth.uid() is null then raise exception 'NOT_AUTHORIZED'; end if;
 select phone into v_phone from auth.users where id=auth.uid() and phone_confirmed_at is not null;
 if nullif(v_phone,'') is null then raise exception 'PHONE_NOT_VERIFIED'; end if;
 if not exists(select 1 from public.merchants where id=p_merchant and active) then raise exception 'NOT_AVAILABLE'; end if;
 insert into public.loyalty_customers(merchant_id,user_id,name,phone,birthday_day,birthday_month)
 values(p_merchant,auth.uid(),trim(p_name),v_phone,p_day,p_month)
 on conflict(merchant_id,user_id) do nothing;
 select card_code into v_id from public.loyalty_customers where merchant_id=p_merchant and user_id=auth.uid() and active;
 if v_id is null then raise exception 'NOT_AVAILABLE'; end if;
 return v_id;
end; $$;

create function private.loyalty_card(p_merchant uuid,p_card uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare c public.loyalty_customers; v_role text; v_program jsonb; v_rewards jsonb; v_history jsonb;
begin
 if auth.uid() is null then raise exception 'NOT_AUTHORIZED'; end if;
 v_role:=private.member_role(p_merchant);
 select * into c from public.loyalty_customers where merchant_id=p_merchant and active
 and ((p_card is not null and card_code=p_card) or (p_card is null and user_id=auth.uid()));
 if c.id is null or (v_role is null and c.user_id<>auth.uid()) or
 not exists(select 1 from public.merchants where id=p_merchant and active) then raise exception 'NOT_AVAILABLE'; end if;
 select jsonb_build_object('stamp_target',stamp_target,'reward_text',reward_text,'minimum_spend_cents',minimum_spend_cents,
 'stamp_expiry_days',stamp_expiry_days,'reward_expiry_days',reward_expiry_days) into v_program from public.programs where merchant_id=p_merchant;
 select coalesce(jsonb_agg(x),'[]') into v_rewards from (
 select id,reward_text,stamp_target,issued_at,expires_at,
 case when voided_operation is not null then 'voided' when redeemed_operation is not null then 'redeemed'
 when expires_at<=now() then 'expired' else 'available' end as status
 from public.loyalty_rewards where merchant_id=p_merchant and customer_id=c.id order by issued_at desc,id limit 100) x;
 select coalesce(jsonb_agg(x),'[]') into v_history from (
 select o.id,o.action,o.created_at,o.reversed_by is not null as reversed,
 case when v_role is not null then o.reason else null end as reason,
 o.target_id, case when o.action='request' then case when o.resolved_by is null then 'pending'
 else (select r.action from public.loyalty_operations r where r.id=o.resolved_by) end else null end as resolution,
 exists(select 1 from public.loyalty_operations r where r.target_id=o.id and r.action='request' and r.resolved_by is null) as correction_pending
 from public.loyalty_operations o where o.merchant_id=p_merchant and o.customer_id=c.id order by o.created_at desc,o.id desc limit 60) x;
 return jsonb_build_object('card_code',c.card_code,'name',c.name,'program',v_program,'rewards',v_rewards,'history',v_history,
 'stamps',(select count(*) from public.loyalty_stamps where merchant_id=p_merchant and customer_id=c.id and reward_id is null and voided_operation is null and (expires_at is null or expires_at>now())),
 'pending_requests',case when v_role='owner' then (select coalesce(jsonb_agg(x),'[]') from (select id,reason,target_id,created_at from public.loyalty_operations where merchant_id=p_merchant and customer_id=c.id and action='request' and resolved_by is null order by created_at limit 100) x) else '[]'::jsonb end,
 'stamp_expires_at',(select min(expires_at) from public.loyalty_stamps where merchant_id=p_merchant and customer_id=c.id and reward_id is null and voided_operation is null and (expires_at is null or expires_at>now())));
end; $$;

create function private.loyalty_command(p_merchant uuid,p_card uuid,p_action text,p_key uuid,p_payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare c public.loyalty_customers; p public.programs; v_role text; v_id uuid:=gen_random_uuid();
 old public.loyalty_operations; req public.loyalty_operations; target public.loyalty_operations;
 reward public.loyalty_rewards; stamp public.loyalty_stamps; v_target uuid; v_count integer; v_loops integer:=0;
begin
 v_role:=private.member_role(p_merchant);
 if auth.uid() is null or v_role is null then raise exception 'NOT_AUTHORIZED'; end if;
 if p_action is null or p_action not in ('stamp','redeem','request','approve','reject') or p_key is null or
 p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>2048 then raise exception 'INVALID_ACTION'; end if;
 if p_action in ('approve','reject') and v_role<>'owner' then raise exception 'OWNER_REQUIRED'; end if;
 -- Every mutation locks the same customer first, serializing stamp/redemption/correction races.
 select * into c from public.loyalty_customers where merchant_id=p_merchant and card_code=p_card and active for update;
 if c.id is null then raise exception 'NOT_AVAILABLE'; end if;
 select * into old from public.loyalty_operations where merchant_id=p_merchant and request_key=p_key;
 if old.id is not null then
  if old.customer_id<>c.id or old.actor_id<>auth.uid() or old.action<>p_action or old.payload<>p_payload then raise exception 'KEY_REUSED'; end if;
  return jsonb_build_object('operation_id',old.id,'action',old.action);
 end if;
 select * into p from public.programs where merchant_id=p_merchant for share;
 if p_action='stamp' then
  if p_payload<>jsonb_build_object('paid',true) then raise exception 'PAYMENT_CONFIRMATION_REQUIRED'; end if;
 elsif p_action='redeem' then
  select * into reward from public.loyalty_rewards where merchant_id=p_merchant and customer_id=c.id and id=(p_payload->>'reward_id')::uuid for update;
  if reward.id is null or reward.redeemed_operation is not null or reward.voided_operation is not null or reward.expires_at<=now() then raise exception 'REWARD_UNAVAILABLE'; end if;
 elsif p_action='request' then
  if length(trim(coalesce(p_payload->>'reason',''))) not between 4 and 500 then raise exception 'REASON_REQUIRED'; end if;
  v_target:=(p_payload->>'operation_id')::uuid;
  select * into target from public.loyalty_operations where merchant_id=p_merchant and customer_id=c.id and id=v_target;
  if target.id is null or target.action not in ('stamp','redeem') or target.reversed_by is not null then raise exception 'CORRECTION_UNAVAILABLE'; end if;
  if exists(select 1 from public.loyalty_operations where target_id=v_target and action='request' and resolved_by is null) then raise exception 'CORRECTION_PENDING'; end if;
 else
  v_target:=(p_payload->>'request_id')::uuid;
  select * into req from public.loyalty_operations where merchant_id=p_merchant and customer_id=c.id and id=v_target and action='request' and resolved_by is null for update;
  if req.id is null then raise exception 'REQUEST_UNAVAILABLE'; end if;
  select * into target from public.loyalty_operations where id=req.target_id and reversed_by is null for update;
  if target.id is null then raise exception 'CORRECTION_UNAVAILABLE'; end if;
 end if;
 insert into public.loyalty_operations(id,merchant_id,customer_id,actor_id,request_key,action,payload,target_id,reason)
 values(v_id,p_merchant,c.id,auth.uid(),p_key,p_action,p_payload,v_target,case when p_action='request' then trim(p_payload->>'reason') end);
 if p_action='stamp' then
  -- Activity renews only valid, unused credits. Expired stamps never revive.
  update public.loyalty_stamps set expires_at=case when p.stamp_expiry_days is null then null else now()+make_interval(days=>p.stamp_expiry_days) end
  where merchant_id=p_merchant and customer_id=c.id and reward_id is null and voided_operation is null and (expires_at is null or expires_at>now());
  insert into public.loyalty_stamps(merchant_id,customer_id,operation_id,expires_at)
  values(p_merchant,c.id,v_id,case when p.stamp_expiry_days is null then null else now()+make_interval(days=>p.stamp_expiry_days) end);
  loop
   select count(*) into v_count from public.loyalty_stamps where merchant_id=p_merchant and customer_id=c.id and reward_id is null and voided_operation is null and (expires_at is null or expires_at>now());
   exit when v_count<p.stamp_target;
   v_loops:=v_loops+1;
   if v_loops>100 then raise exception 'REWARD_BATCH_LIMIT'; end if;
   insert into public.loyalty_rewards(merchant_id,customer_id,reward_text,stamp_target,issued_operation,expires_at)
   values(p_merchant,c.id,p.reward_text,p.stamp_target,v_id,case when p.reward_expiry_days is null then null else now()+make_interval(days=>p.reward_expiry_days) end) returning * into reward;
   update public.loyalty_stamps set reward_id=reward.id where id in
   (select id from public.loyalty_stamps where merchant_id=p_merchant and customer_id=c.id and reward_id is null and voided_operation is null and (expires_at is null or expires_at>now()) order by created_at,id limit p.stamp_target);
  end loop;
 elsif p_action='redeem' then
  update public.loyalty_rewards set redeemed_operation=v_id where id=reward.id;
 elsif p_action in ('approve','reject') then
  if p_action='approve' then
   if target.action='stamp' then
    select * into stamp from public.loyalty_stamps where operation_id=target.id;
    if stamp.reward_id is not null then
     select * into reward from public.loyalty_rewards where id=stamp.reward_id for update;
     if reward.redeemed_operation is not null then raise exception 'REVERSE_REDEMPTION_FIRST'; end if;
     update public.loyalty_rewards set voided_operation=v_id where id=reward.id;
     -- Preserve expiry on released credits; a correction is not paid activity.
     update public.loyalty_stamps set reward_id=null where reward_id=reward.id;
    end if;
    update public.loyalty_stamps set voided_operation=v_id where id=stamp.id;
   else
    update public.loyalty_rewards set redeemed_operation=null where redeemed_operation=target.id;
    if not found then raise exception 'CORRECTION_UNAVAILABLE'; end if;
   end if;
   update public.loyalty_operations set reversed_by=v_id where id=target.id;
  end if;
  update public.loyalty_operations set resolved_by=v_id where id=req.id;
 end if;
 insert into public.audit_events(merchant_id,actor_id,action) values(p_merchant,auth.uid(),'loyalty.'||p_action);
 return jsonb_build_object('operation_id',v_id,'action',p_action);
end; $$;

create function public.enroll_loyalty(p_merchant uuid,p_name text,p_day integer default null,p_month integer default null) returns uuid
language sql security invoker set search_path='' as $$ select private.enroll_loyalty(p_merchant,p_name,p_day,p_month); $$;
create function public.loyalty_card(p_merchant uuid,p_card uuid default null) returns jsonb
language sql stable security invoker set search_path='' as $$ select private.loyalty_card(p_merchant,p_card); $$;
create function public.loyalty_command(p_merchant uuid,p_card uuid,p_action text,p_key uuid,p_payload jsonb) returns jsonb
language sql security invoker set search_path='' as $$ select private.loyalty_command(p_merchant,p_card,p_action,p_key,p_payload); $$;
revoke all on function private.enroll_loyalty(uuid,text,integer,integer),private.loyalty_card(uuid,uuid),private.loyalty_command(uuid,uuid,text,uuid,jsonb),
 public.enroll_loyalty(uuid,text,integer,integer),public.loyalty_card(uuid,uuid),public.loyalty_command(uuid,uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function private.enroll_loyalty(uuid,text,integer,integer),private.loyalty_card(uuid,uuid),private.loyalty_command(uuid,uuid,text,uuid,jsonb),
 public.enroll_loyalty(uuid,text,integer,integer),public.loyalty_card(uuid,uuid),public.loyalty_command(uuid,uuid,text,uuid,jsonb) to authenticated;
commit;
