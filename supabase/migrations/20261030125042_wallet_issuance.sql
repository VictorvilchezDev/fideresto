-- Short-lived delivery capabilities. No customer portal and no service-role key.
begin;
create table public.wallet_deliveries (
 token_hash text primary key check(token_hash ~ '^[0-9a-f]{64}$'),
 merchant_id uuid not null, customer_id uuid not null,
 issued_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '15 minutes',
 foreign key(merchant_id,customer_id) references public.loyalty_customers(merchant_id,id),
 check(expires_at>created_at and expires_at<=created_at+interval '15 minutes')
);
create index wallet_deliveries_customer_idx on public.wallet_deliveries(merchant_id,customer_id,created_at desc);
alter table public.wallet_deliveries enable row level security;
revoke all on public.wallet_deliveries from public,anon,authenticated;
create function private.create_wallet_delivery(p_merchant uuid,p_card uuid,p_token_hash text) returns timestamptz
language plpgsql security definer set search_path='' as $$
declare c public.loyalty_customers; expiry timestamptz;
begin
 if auth.uid() is null or private.member_role(p_merchant) is null then raise exception 'NOT_AUTHORIZED'; end if;
 select * into c from public.loyalty_customers where merchant_id=p_merchant and card_code=p_card and active for update;
 if c.id is null then raise exception 'NOT_AVAILABLE'; end if;
 if c.phone_verified_at is null then raise exception 'PHONE_NOT_VERIFIED'; end if;
 if (select count(*) from public.wallet_deliveries where merchant_id=p_merchant and customer_id=c.id and expires_at>now())>=5 then raise exception 'WALLET_DELIVERY_LIMIT'; end if;
 insert into public.wallet_deliveries(token_hash,merchant_id,customer_id,issued_by) values(p_token_hash,p_merchant,c.id,auth.uid()) returning expires_at into expiry;
 insert into public.audit_events(merchant_id,actor_id,action) values(p_merchant,auth.uid(),'wallet.delivery:'||c.id);
 return expiry;
end; $$;
create function private.wallet_delivery(p_token_hash text) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare c public.loyalty_customers; p public.programs; business text;
begin
 if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then return null; end if;
 select customer.* into c from public.wallet_deliveries d join public.loyalty_customers customer on customer.id=d.customer_id and customer.merchant_id=d.merchant_id
 join public.merchants m on m.id=d.merchant_id and m.active
 where d.token_hash=p_token_hash and d.expires_at>now() and customer.active and customer.phone_verified_at is not null;
 if c.id is null then return null; end if;
 select * into p from public.programs where merchant_id=c.merchant_id;
 select name into business from public.merchants where id=c.merchant_id;
 return jsonb_build_object('merchantId',c.merchant_id,'cardCode',c.card_code,'merchantName',business,'target',p.stamp_target,'rewardText',p.reward_text,'sample',false,
 'stamps',(select count(*) from public.loyalty_stamps where merchant_id=c.merchant_id and customer_id=c.id and reward_id is null and voided_operation is null and (expires_at is null or expires_at>now())),
 'availableRewards',(select count(*) from public.loyalty_rewards where merchant_id=c.merchant_id and customer_id=c.id and redeemed_operation is null and voided_operation is null and (expires_at is null or expires_at>now())));
end; $$;
create function public.create_wallet_delivery(p_merchant uuid,p_card uuid,p_token_hash text) returns timestamptz
language sql security invoker set search_path='' as $$ select private.create_wallet_delivery(p_merchant,p_card,p_token_hash); $$;
create function public.wallet_delivery(p_token_hash text) returns jsonb
language sql stable security invoker set search_path='' as $$ select private.wallet_delivery(p_token_hash); $$;
revoke all on function private.create_wallet_delivery(uuid,uuid,text),public.create_wallet_delivery(uuid,uuid,text),private.wallet_delivery(text),public.wallet_delivery(text) from public,anon,authenticated;
grant execute on function private.create_wallet_delivery(uuid,uuid,text),public.create_wallet_delivery(uuid,uuid,text) to authenticated;
-- The private schema remains unexposed by PostgREST. Only this minimal projection
-- can be called anonymously, using a random 256-bit delivery capability hash.
grant usage on schema private to anon;
grant execute on function private.wallet_delivery(text),public.wallet_delivery(text) to anon,authenticated;
commit;
