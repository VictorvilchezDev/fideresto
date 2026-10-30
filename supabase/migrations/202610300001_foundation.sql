-- Fideresto foundation. Run only in the dedicated Fideresto project.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table private.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
revoke all on private.platform_admins from anon, authenticated;

create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.memberships (
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  primary key (merchant_id, user_id)
);
create index memberships_user_idx on public.memberships(user_id);
create table public.programs (
  merchant_id uuid primary key references public.merchants(id) on delete cascade,
  stamp_target integer not null default 8 check (stamp_target between 1 and 100),
  reward_text text not null default 'Un café por cuenta de la casa' check (char_length(trim(reward_text)) between 1 and 240),
  minimum_spend_cents integer not null default 0 check (minimum_spend_cents between 0 and 10000000),
  stamp_expiry_days integer check (stamp_expiry_days between 1 and 3650),
  reward_expiry_days integer check (reward_expiry_days between 1 and 3650),
  updated_at timestamptz not null default now()
);
create table public.nfc_tags (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 1 and 60),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index nfc_tags_merchant_idx on public.nfc_tags(merchant_id);
create table public.audit_events (
  id bigint generated always as identity primary key,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  actor_id uuid,
  action text not null,
  created_at timestamptz not null default now()
);
create index audit_events_merchant_idx on public.audit_events(merchant_id, created_at desc);

create function private.member_role(target uuid) returns text
language sql stable security definer set search_path = '' as $$
  select m.role from public.memberships m join public.merchants b on b.id=m.merchant_id
  where m.merchant_id=target and m.user_id=(select auth.uid()) and b.active;
$$;
revoke all on function private.member_role(uuid) from public, anon;
grant execute on function private.member_role(uuid) to authenticated;

create function public.is_platform_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from private.platform_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

alter table public.merchants enable row level security;
alter table public.memberships enable row level security;
alter table public.programs enable row level security;
alter table public.nfc_tags enable row level security;
alter table public.audit_events enable row level security;
create policy merchant_read on public.merchants for select to authenticated using (private.member_role(id) is not null);
create policy membership_read on public.memberships for select to authenticated
  using (private.member_role(merchant_id) is not null and (user_id=(select auth.uid()) or private.member_role(merchant_id)='owner'));
create policy program_read on public.programs for select to authenticated using (private.member_role(merchant_id) is not null);
create policy program_owner_update on public.programs for update to authenticated
  using (private.member_role(merchant_id)='owner') with check (private.member_role(merchant_id)='owner');
create policy tag_owner_read on public.nfc_tags for select to authenticated using (private.member_role(merchant_id)='owner');
create policy tag_owner_insert on public.nfc_tags for insert to authenticated with check (private.member_role(merchant_id)='owner');
create policy tag_owner_update on public.nfc_tags for update to authenticated
  using (private.member_role(merchant_id)='owner') with check (private.member_role(merchant_id)='owner');
create policy audit_owner_read on public.audit_events for select to authenticated using (private.member_role(merchant_id)='owner');

revoke all on public.merchants, public.memberships, public.programs, public.nfc_tags, public.audit_events from anon, authenticated;
grant select on public.merchants, public.memberships, public.programs, public.nfc_tags, public.audit_events to authenticated;
grant update(stamp_target,reward_text,minimum_spend_cents,stamp_expiry_days,reward_expiry_days) on public.programs to authenticated;
grant insert(merchant_id,label), update(active) on public.nfc_tags to authenticated;

create function private.audit_config() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_TABLE_NAME='programs' then new.updated_at=now(); end if;
  insert into public.audit_events(merchant_id,actor_id,action)
    values (new.merchant_id,auth.uid(),TG_TABLE_NAME||'.'||lower(TG_OP));
  return new;
end;
$$;
revoke all on function private.audit_config() from public,anon,authenticated;
create trigger audit_program before update on public.programs for each row execute function private.audit_config();
create trigger audit_nfc before insert or update on public.nfc_tags for each row execute function private.audit_config();

create function public.admin_list_merchants() returns table(id uuid,name text,active boolean,created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_platform_admin() then raise insufficient_privilege using message='Not authorized'; end if;
  return query select m.id,m.name,m.active,m.created_at from public.merchants m order by m.created_at desc limit 100;
end;
$$;
create function public.admin_create_merchant(business_name text, owner_email text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare owner_user uuid; business_id uuid;
begin
  if not public.is_platform_admin() then raise insufficient_privilege using message='Not authorized'; end if;
  select id into owner_user from auth.users where lower(email)=lower(trim(owner_email)) and email_confirmed_at is not null;
  if owner_user is null then raise exception 'OWNER_NOT_READY'; end if;
  insert into public.merchants(name) values(trim(business_name)) returning id into business_id;
  insert into public.memberships(merchant_id,user_id,role) values(business_id,owner_user,'owner');
  insert into public.programs(merchant_id) values(business_id);
  insert into public.audit_events(merchant_id,actor_id,action) values(business_id,auth.uid(),'merchant.create');
  return business_id;
end;
$$;
revoke all on function public.admin_list_merchants(), public.admin_create_merchant(text,text) from public,anon;
grant execute on function public.admin_list_merchants(), public.admin_create_merchant(text,text) to authenticated;

-- Minimal public entry point. No contacts, membership IDs, or permissions in a tag.
create function public.public_tag(tag_id uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('name',m.name,'reward_text',p.reward_text,'stamp_target',p.stamp_target,
    'minimum_spend_cents',p.minimum_spend_cents,'stamp_expiry_days',p.stamp_expiry_days,'reward_expiry_days',p.reward_expiry_days)
  from public.nfc_tags t join public.merchants m on m.id=t.merchant_id join public.programs p on p.merchant_id=m.id
  where t.id=tag_id and t.active and m.active;
$$;
revoke all on function public.public_tag(uuid) from public;
grant execute on function public.public_tag(uuid) to anon,authenticated;
commit;
