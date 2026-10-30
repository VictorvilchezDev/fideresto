-- Execute after migration in a disposable database; all fixtures roll back.
begin;
create function public.test_assert(ok boolean, message text) returns void language plpgsql as $$
begin if ok is distinct from true then raise exception 'TEST FAILED: %',message; end if; end; $$;
grant execute on function public.test_assert(boolean,text) to authenticated,anon;
insert into auth.users(id,email,email_confirmed_at) values
 ('10000000-0000-4000-8000-000000000001','owner-a@example.invalid',now()),
 ('10000000-0000-4000-8000-000000000002','staff-a@example.invalid',now()),
 ('10000000-0000-4000-8000-000000000003','owner-b@example.invalid',now()),
 ('10000000-0000-4000-8000-000000000004','admin@example.invalid',now());
insert into private.platform_admins(user_id) values ('10000000-0000-4000-8000-000000000004');
insert into public.merchants(id,name) values
 ('20000000-0000-4000-8000-000000000001','Business A'), ('20000000-0000-4000-8000-000000000002','Business B');
insert into public.memberships(merchant_id,user_id,role) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','owner'),
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','staff'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003','owner');
insert into public.programs(merchant_id) select id from public.merchants;
insert into public.nfc_tags(id,merchant_id,label) values('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Counter');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
select public.test_assert((select count(*)=1 from public.merchants),'owner isolated from business B');
select public.test_assert((select count(*)=2 from public.memberships),'owner sees only own team');
update public.programs set minimum_spend_cents=0,reward_text='A free-text reward',stamp_expiry_days=null,reward_expiry_days=30 where merchant_id='20000000-0000-4000-8000-000000000001';
select public.test_assert((select reward_text='A free-text reward' and minimum_spend_cents=0 and stamp_expiry_days is null and reward_expiry_days=30 from public.programs where merchant_id='20000000-0000-4000-8000-000000000001'),'owner writes program and independent expiry');
update public.programs set reward_text='Hacked' where merchant_id='20000000-0000-4000-8000-000000000002';
do $$ begin
  begin insert into public.nfc_tags(merchant_id,label) values('20000000-0000-4000-8000-000000000002','Injected'); raise exception 'Cross-tenant insert succeeded'; exception when insufficient_privilege then null; end;
  begin update public.programs set merchant_id='20000000-0000-4000-8000-000000000002'; raise exception 'Tenant reassignment succeeded'; exception when insufficient_privilege then null; end;
  begin perform public.admin_create_merchant('Illegal','owner-a@example.invalid'); raise exception 'Non-admin provision succeeded'; exception when insufficient_privilege then null; end;
end; $$;
select public.test_assert((select count(*)>=2 from public.audit_events),'owner sees own audit');

select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000002',true);
select public.test_assert((select count(*)=1 from public.memberships),'staff cannot enumerate team');
select public.test_assert((select count(*)=0 from public.nfc_tags),'staff cannot list owner tags');
select public.test_assert((select count(*)=0 from public.audit_events),'staff cannot read owner audit');
update public.programs set reward_text='Staff override' where merchant_id='20000000-0000-4000-8000-000000000001';
select public.test_assert((select reward_text='A free-text reward' from public.programs),'staff update affects no rows');
do $$ begin
  begin insert into public.memberships(merchant_id,user_id,role) values('20000000-0000-4000-8000-000000000002',auth.uid(),'owner'); raise exception 'Self promotion succeeded'; exception when insufficient_privilege then null; end;
  begin insert into private.platform_admins(user_id) values(auth.uid()); raise exception 'Platform promotion succeeded'; exception when insufficient_privilege then null; end;
  begin insert into public.nfc_tags(merchant_id,label) values('20000000-0000-4000-8000-000000000001','Staff tag'); raise exception 'Staff NFC insert succeeded'; exception when insufficient_privilege then null; end;
  begin perform public.admin_list_merchants(); raise exception 'Staff admin list succeeded'; exception when insufficient_privilege then null; end;
end; $$;

select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000003',true);
select public.test_assert((select reward_text='Un café por cuenta de la casa' from public.programs),'business B unchanged');
select public.test_assert((select count(*)=0 from public.nfc_tags),'business B cannot see business A NFC');

select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000004',true);
select public.test_assert(public.is_platform_admin(),'explicit admin assignment');
select public.test_assert((select count(*)=2 from public.admin_list_merchants()),'admin summary RPC available');
select public.test_assert((select count(*)=0 from public.programs),'platform admin has no automatic operational access');
select public.test_assert(public.admin_create_merchant('Business C','owner-b@example.invalid') is not null,'admin provisions business and owner');

reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
select public.test_assert(public.public_tag('30000000-0000-4000-8000-000000000001')->>'name'='Business A','anonymous entry returns public program');
select public.test_assert(not(public.public_tag('30000000-0000-4000-8000-000000000001') ? 'user_id'),'public entry has no user IDs');
do $$ begin
  begin perform count(*) from public.merchants; raise exception 'Anon table access succeeded'; exception when insufficient_privilege then null; end;
  begin perform public.is_platform_admin(); raise exception 'Anon admin check succeeded'; exception when insufficient_privilege then null; end;
end; $$;
reset role;
update public.nfc_tags set active=false where id='30000000-0000-4000-8000-000000000001';
set local role anon;
select public.test_assert(public.public_tag('30000000-0000-4000-8000-000000000001') is null,'disabled tag returns nothing');
reset role;
rollback;
select 'Foundation RLS tests passed' as result;
