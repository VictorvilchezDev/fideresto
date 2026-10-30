import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { deliveryHash, newDeliveryToken } from "../src/lib/wallet/delivery";
const merchant = "20000000-0000-4000-8000-000000000001",
  other = "20000000-0000-4000-8000-000000000002",
  card = "30000000-0000-4000-8000-000000000001";
test(
  "Wallet SQL delivery enforces verified phone, membership, expiration and minimal disclosure",
  { timeout: 60000 },
  async (t) => {
    const db = new PGlite();
    try {
      await db.exec(await readFile("supabase/tests/bootstrap-local.sql", "utf8"));
      for (const file of (await readdir("supabase/migrations"))
        .filter((f) => f.endsWith(".sql"))
        .sort())
        await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
      await db.exec(await readFile("supabase/tests/loyalty-fixtures.sql", "utf8"));
      async function actor(n: number) {
        await db.exec("reset role;set local role authenticated");
        await db.query("select set_config('request.jwt.claim.sub',$1,true)", [
          `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
        ]);
      }
      async function fails(fn: () => Promise<unknown>, pattern: RegExp) {
        await db.exec("savepoint failure");
        try {
          await assert.rejects(fn, pattern);
        } finally {
          await db.exec("rollback to savepoint failure;release savepoint failure");
        }
      }
      const mint = (hash: string, m = merchant) =>
        db.query("select public.create_wallet_delivery($1,$2,$3)", [m, card, hash]);
      const view = async (hash: string | null) =>
        (
          await db.query<{ data: Record<string, unknown> | null }>(
            "select public.wallet_delivery($1) data",
            [hash],
          )
        ).rows[0].data;
      async function scenario(name: string, fn: () => Promise<void>) {
        await t.test(name, async () => {
          await db.exec("begin");
          try {
            await actor(2);
            await fn();
          } finally {
            await db.exec("rollback");
          }
        });
      }
      await scenario(
        "staff creates short-lived delivery; anon sees only card data and no tables/helpers",
        async () => {
          const hash = deliveryHash(newDeliveryToken());
          await mint(hash);
          await db.exec("reset role;set local role anon");
          const data = await view(hash);
          assert.ok(data);
          assert.deepEqual(
            Object.keys(data).sort(),
            [
              "merchantId",
              "cardCode",
              "merchantName",
              "target",
              "rewardText",
              "sample",
              "stamps",
              "availableRewards",
            ].sort(),
          );
          assert.equal(data.cardCode, card);
          assert.equal(data.stamps, 0);
          assert.equal(await view("0".repeat(64)), null);
          assert.equal(await view(null), null);
          assert.equal(await view("bad"), null);
          await fails(
            () => db.query("select * from public.wallet_deliveries"),
            /permission denied/,
          );
          await fails(
            () => db.query("select * from public.loyalty_customers"),
            /permission denied/,
          );
          await fails(
            () => db.query("select private.loyalty_card_ledger($1,$2)", [merchant, card]),
            /permission denied/,
          );
          await fails(() => mint(deliveryHash(newDeliveryToken())), /permission denied/);
          const grants = (
            await db.query<{ name: string }>(
              "select p.oid::regprocedure::text as name from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and has_function_privilege('anon',p.oid,'EXECUTE')",
            )
          ).rows;
          assert.deepEqual(
            grants.map((v) => v.name),
            ["private.wallet_delivery(text)"],
          );
        },
      );
      await scenario(
        "consumers and other merchants cannot mint; unverified profile fails closed",
        async () => {
          await actor(3);
          await fails(() => mint(deliveryHash(newDeliveryToken())), /NOT_AUTHORIZED/);
          await actor(5);
          await fails(() => mint(deliveryHash(newDeliveryToken())), /NOT_AUTHORIZED/);
          await actor(2);
          await fails(() => mint(deliveryHash(newDeliveryToken()), other), /NOT_AUTHORIZED/);
          const hash = deliveryHash(newDeliveryToken());
          await mint(hash);
          await db.query(
            "select public.update_loyalty_customer($1,$2,'Alex','+34000000009',null,null,1)",
            [merchant, card],
          );
          assert.equal(await view(hash), null);
          await fails(() => mint(deliveryHash(newDeliveryToken())), /PHONE_NOT_VERIFIED/);
        },
      );
      await scenario("expired, inactive and excess capabilities are rejected", async () => {
        const hash = deliveryHash(newDeliveryToken());
        await mint(hash);
        for (let i = 0; i < 4; i++) await mint(deliveryHash(newDeliveryToken()));
        await fails(() => mint(deliveryHash(newDeliveryToken())), /WALLET_DELIVERY_LIMIT/);
        await db.exec("reset role");
        await db.query(
          "update public.wallet_deliveries set created_at=now()-interval '20 minutes',expires_at=now()-interval '5 minutes' where token_hash=$1",
          [hash],
        );
        assert.equal(await view(hash), null);
        await actor(2);
        const fresh = deliveryHash(newDeliveryToken());
        await mint(fresh);
        await db.exec("reset role");
        await db.query("update public.merchants set active=false where id=$1", [merchant]);
        assert.equal(await view(fresh), null);
      });
    } finally {
      await db.close();
    }
  },
);
