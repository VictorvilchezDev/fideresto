-- Disposable local data only. Never run in hosted Supabase.
insert into auth.users(id,email,phone,phone_confirmed_at) values
 ('10000000-0000-4000-8000-000000000001','owner@example.invalid',null,null),
 ('10000000-0000-4000-8000-000000000002','staff@example.invalid',null,null),
 ('10000000-0000-4000-8000-000000000003',null,'+34000000001',now()),
 ('10000000-0000-4000-8000-000000000004',null,'+34000000002',now()),
 ('10000000-0000-4000-8000-000000000005','other@example.invalid',null,null),
 ('10000000-0000-4000-8000-000000000006',null,'+34000000003',null);
insert into public.merchants(id,name) values
 ('20000000-0000-4000-8000-000000000001','Café Oliva · laboratorio'),
 ('20000000-0000-4000-8000-000000000002','Otro comercio ficticio');
insert into public.memberships(merchant_id,user_id,role) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','owner'),
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','staff'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000005','owner');
insert into public.programs(merchant_id,stamp_target,reward_text,stamp_expiry_days,reward_expiry_days) values
 ('20000000-0000-4000-8000-000000000001',3,'Un café por cuenta de la casa',30,60),
 ('20000000-0000-4000-8000-000000000002',3,'Otro premio',null,null);
set role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000003',false);
select public.enroll_loyalty('20000000-0000-4000-8000-000000000001','Alex',null,null);
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000004',false);
select public.enroll_loyalty('20000000-0000-4000-8000-000000000001','Mar',29,2);
reset role;
-- Stable fake card codes make reproducible QA possible; production codes stay random.
update public.loyalty_customers set card_code='30000000-0000-4000-8000-000000000001' where name='Alex';
update public.loyalty_customers set card_code='30000000-0000-4000-8000-000000000002' where name='Mar';
