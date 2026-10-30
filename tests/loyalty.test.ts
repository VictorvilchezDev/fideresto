import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import type { Card } from "../src/lib/loyalty/types";
import { localLabRequestAllowed, readSmallJson } from "../src/lib/loyalty/request";
const m = "20000000-0000-4000-8000-000000000001",
  other = "20000000-0000-4000-8000-000000000002",
  alex = "30000000-0000-4000-8000-000000000001",
  mar = "30000000-0000-4000-8000-000000000002";
const user = (n: number) => `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
test(
  "loyalty transactions enforce rules, identity and authorization",
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
        await db.query("select set_config('request.jwt.claim.sub',$1,true)", [user(n)]);
      }
      async function root() {
        await db.exec("reset role");
      }
      async function card(code = alex, merchant = m) {
        return (
          await db.query<{ card: Card }>("select public.loyalty_card($1,$2) as card", [
            merchant,
            code,
          ])
        ).rows[0].card;
      }
      async function command(
        action: string,
        payload: Record<string, unknown>,
        key = randomUUID(),
        code = alex,
        merchant = m,
      ) {
        return (
          await db.query<{ result: { operation_id: string; action: string } }>(
            "select public.loyalty_command($1,$2,$3,$4,$5::jsonb) as result",
            [merchant, code, action, key, JSON.stringify(payload)],
          )
        ).rows[0].result;
      }
      async function fails(fn: () => Promise<unknown>, pattern: RegExp) {
        await db.exec("savepoint expected_failure");
        try {
          await assert.rejects(fn, pattern);
        } finally {
          await db.exec(
            "rollback to savepoint expected_failure;release savepoint expected_failure",
          );
        }
      }
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
      async function earn() {
        for (let i = 0; i < 3; i++) await command("stamp", { paid: true });
        return (await card()).rewards[0];
      }
      await scenario(
        "phone verification comes from auth.users, enrollment is idempotent and birthdays validate",
        async () => {
          await actor(6);
          await fails(
            () => db.query("select public.enroll_loyalty($1,'Sin verificar')", [m]),
            /PHONE_NOT_VERIFIED/,
          );
          await actor(3);
          const result = await db.query<{ code: string }>(
            "select public.enroll_loyalty($1,'Alex') as code",
            [m],
          );
          assert.equal(result.rows[0].code, alex);
          await actor(4);
          await fails(
            () => db.query("select public.enroll_loyalty($1,'Mar',31,2)", [other]),
            /check constraint/,
          );
        },
      );
      await scenario(
        "anonymous, consumers and other merchants cannot stamp, read or mutate another card",
        async () => {
          await actor(5);
          await fails(() => card(), /NOT_AVAILABLE/);
          await fails(() => command("stamp", { paid: true }), /NOT_AUTHORIZED/);
          await actor(3);
          assert.equal((await card()).name, "Alex");
          await fails(() => card(mar), /NOT_AVAILABLE/);
          await fails(() => command("stamp", { paid: true }), /NOT_AUTHORIZED/);
          await fails(
            () => db.query("select * from public.loyalty_customers"),
            /permission denied/,
          );
          await actor(2);
          await fails(
            () => db.exec("update public.loyalty_stamps set expires_at=null"),
            /permission denied/,
          );
          assert.equal(
            (await db.query("update public.programs set stamp_target=1 returning merchant_id")).rows
              .length,
            0,
          );
          await db.exec("set local role anon");
          await fails(() => card(), /permission denied/);
        },
      );
      await scenario(
        "minimum is attested, retries return the same operation and cannot change payload or actor",
        async () => {
          await fails(() => command("stamp", { paid: false }), /PAYMENT_CONFIRMATION_REQUIRED/);
          const key = randomUUID();
          const a = await command("stamp", { paid: true }, key);
          const b = await command("stamp", { paid: true }, key);
          assert.deepEqual(a, b);
          assert.equal((await card()).stamps, 1);
          await fails(() => command("stamp", { paid: false }, key), /KEY_REUSED/);
          await fails(() => command("stamp", { paid: true }, key, mar), /KEY_REUSED/);
          await actor(1);
          await fails(() => command("stamp", { paid: true }, key), /KEY_REUSED/);
        },
      );
      await scenario(
        "seasonal changes affect unfinished cards while earned rewards preserve text and expiry",
        async () => {
          const earned = await earn();
          await command("stamp", { paid: true });
          await actor(1);
          await db.query(
            "update public.programs set reward_text='Desayuno de invierno',reward_expiry_days=10 where merchant_id=$1",
            [m],
          );
          await command("stamp", { paid: true });
          await command("stamp", { paid: true });
          const c = await card();
          assert.equal(c.stamps, 0);
          assert.equal(c.rewards.length, 2);
          assert.equal(
            c.rewards.find((r) => r.id === earned.id)?.reward_text,
            "Un café por cuenta de la casa",
          );
          assert.equal(c.rewards.find((r) => r.id === earned.id)?.expires_at, earned.expires_at);
          assert.ok(c.rewards.some((r) => r.reward_text === "Desayuno de invierno"));
          await command("stamp", { paid: true });
          assert.equal((await card()).stamps, 1);
        },
      );
      await scenario(
        "redemption retries are idempotent and a second operation cannot redeem twice",
        async () => {
          const reward = await earn();
          const key = randomUUID();
          const a = await command("redeem", { reward_id: reward.id }, key);
          assert.deepEqual(await command("redeem", { reward_id: reward.id }, key), a);
          await fails(() => command("redeem", { reward_id: reward.id }), /REWARD_UNAVAILABLE/);
          assert.equal((await card()).rewards[0].status, "redeemed");
          await fails(
            () => command("redeem", { reward_id: reward.id }, randomUUID(), mar),
            /REWARD_UNAVAILABLE/,
          );
        },
      );
      await scenario(
        "expired stamps never revive, only live unused stamps renew; expiry can be disabled",
        async () => {
          await command("stamp", { paid: true });
          await root();
          await db.exec("update public.loyalty_stamps set expires_at=now()-interval '1 day'");
          await actor(2);
          assert.equal((await card()).stamps, 0);
          await command("stamp", { paid: true });
          assert.equal((await card()).stamps, 1);
          await root();
          const expired = await db.query<{ n: number }>(
            "select count(*)::int as n from public.loyalty_stamps where expires_at<now()",
          );
          assert.equal(expired.rows[0].n, 1);
          await actor(1);
          await db.query(
            "update public.programs set stamp_expiry_days=null,reward_expiry_days=null where merchant_id=$1",
            [m],
          );
          await command("stamp", { paid: true });
          await command("stamp", { paid: true });
          assert.equal((await card()).rewards[0].expires_at, null);
        },
      );
      await scenario("expired rewards are rejected without scheduled cleanup", async () => {
        const reward = await earn();
        await root();
        await db.query(
          "update public.loyalty_rewards set expires_at=now()-interval '1 second' where id=$1",
          [reward.id],
        );
        await actor(2);
        assert.equal((await card()).rewards[0].status, "expired");
        await fails(() => command("redeem", { reward_id: reward.id }), /REWARD_UNAVAILABLE/);
      });
      await scenario(
        "corrections require a reason and owner authorization, preserve originals and cannot resolve twice",
        async () => {
          const stamp = await command("stamp", { paid: true });
          await fails(
            () => command("request", { operation_id: stamp.operation_id, reason: "" }),
            /REASON_REQUIRED/,
          );
          const request = await command("request", {
            operation_id: stamp.operation_id,
            reason: "Sello confirmado por error",
          });
          assert.equal((await card()).stamps, 1);
          await fails(
            () =>
              command("request", { operation_id: stamp.operation_id, reason: "Otra solicitud" }),
            /CORRECTION_PENDING/,
          );
          await fails(
            () => command("approve", { request_id: request.operation_id }),
            /OWNER_REQUIRED/,
          );
          await actor(1);
          await command("approve", { request_id: request.operation_id });
          const c = await card();
          assert.equal(c.stamps, 0);
          assert.ok(c.history.find((h) => h.id === stamp.operation_id)?.reversed);
          await fails(
            () => command("approve", { request_id: request.operation_id }),
            /REQUEST_UNAVAILABLE/,
          );
          await fails(
            () => command("request", { operation_id: stamp.operation_id, reason: "Otro error" }),
            /CORRECTION_UNAVAILABLE/,
          );
        },
      );
      await scenario(
        "voiding an earned reward releases other credits without renewing their expiry",
        async () => {
          const stamp = await command("stamp", { paid: true });
          await command("stamp", { paid: true });
          await command("stamp", { paid: true });
          const original = (await card()).rewards[0];
          const request = await command("request", {
            operation_id: stamp.operation_id,
            reason: "Cuenta duplicada",
          });
          await actor(1);
          await command("approve", { request_id: request.operation_id });
          const c = await card();
          assert.equal(c.stamps, 2);
          assert.equal(c.rewards.find((r) => r.id === original.id)?.status, "voided");
          await command("stamp", { paid: true });
          assert.equal((await card()).rewards.filter((r) => r.status === "available").length, 1);
        },
      );
      await scenario(
        "a redeemed reward requires reversing redemption first; restoration preserves expiry",
        async () => {
          const stamp = await command("stamp", { paid: true });
          await command("stamp", { paid: true });
          await command("stamp", { paid: true });
          const reward = (await card()).rewards[0];
          const redemption = await command("redeem", { reward_id: reward.id });
          const request = await command("request", {
            operation_id: stamp.operation_id,
            reason: "Sello duplicado",
          });
          await actor(1);
          await fails(
            () => command("approve", { request_id: request.operation_id }),
            /REVERSE_REDEMPTION_FIRST/,
          );
          const undoRedeem = await command("request", {
            operation_id: redemption.operation_id,
            reason: "Canje registrado por error",
          });
          await command("approve", { request_id: undoRedeem.operation_id });
          const restored = (await card()).rewards[0];
          assert.equal(restored.status, "available");
          assert.equal(restored.expires_at, reward.expires_at);
          await command("approve", { request_id: request.operation_id });
          assert.equal((await card()).stamps, 2);
        },
      );
      await scenario(
        "rejected correction leaves the stamp valid and consumer never receives staff reasons",
        async () => {
          const stamp = await command("stamp", { paid: true });
          const r = await command("request", {
            operation_id: stamp.operation_id,
            reason: "Motivo interno ficticio",
          });
          await actor(1);
          await command("reject", { request_id: r.operation_id });
          assert.equal((await card()).stamps, 1);
          await actor(3);
          assert.ok((await card()).history.every((h) => h.reason === null));
        },
      );
      await scenario(
        "pending approvals remain accessible beyond the recent history window",
        async () => {
          const stamp = await command("stamp", { paid: true });
          const request = await command("request", {
            operation_id: stamp.operation_id,
            reason: "Solicitud antigua de prueba",
          });
          await root();
          await db.query(
            "update public.loyalty_operations set created_at=now()-interval '1 day' where id=$1",
            [request.operation_id],
          );
          await actor(2);
          for (let i = 0; i < 62; i++) await command("stamp", { paid: true });
          await actor(1);
          const current = await card();
          assert.equal(current.history.length, 60);
          assert.ok(!current.history.some((h) => h.id === request.operation_id));
          assert.ok(current.pending_requests.some((r) => r.id === request.operation_id));
        },
      );
      await scenario(
        "all loyalty tables deny direct writes and all privileged helpers are private",
        async () => {
          await root();
          const exposed = await db.query<{ name: string }>(
            "select proname as name from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef and p.proname in ('enroll_loyalty','loyalty_card','loyalty_command')",
          );
          assert.equal(exposed.rows.length, 0);
          const tables = await db.query<{ relname: string; relrowsecurity: boolean }>(
            "select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname in ('loyalty_customers','loyalty_operations','loyalty_rewards','loyalty_stamps')",
          );
          assert.equal(tables.rows.length, 4);
          assert.ok(tables.rows.every((t) => t.relrowsecurity));
          await actor(2);
          await fails(() => db.exec("delete from public.loyalty_operations"), /permission denied/);
        },
      );
      await scenario("deactivating a merchant revokes operational access", async () => {
        await root();
        await db.query("update public.merchants set active=false where id=$1", [m]);
        await actor(2);
        await fails(() => card(), /NOT_AVAILABLE/);
        await fails(() => command("stamp", { paid: true }), /NOT_AUTHORIZED/);
      });
    } finally {
      await db.close();
    }
  },
);
test("local laboratory requires development, explicit opt-in, loopback and same origin", () => {
  const env = process.env as Record<string, string | undefined>;
  const oldNode = env.NODE_ENV,
    oldLab = process.env.FIDERESTO_LOCAL_LAB;
  try {
    env.NODE_ENV = "development";
    process.env.FIDERESTO_LOCAL_LAB = "1";
    assert.equal(
      localLabRequestAllowed(
        new Request("http://127.0.0.1:3017/api/laboratorio", {
          method: "POST",
          headers: { Origin: "http://127.0.0.1:3017" },
        }),
      ),
      true,
    );
    assert.equal(
      localLabRequestAllowed(
        new Request("http://127.0.0.1:3017/api/laboratorio", {
          method: "POST",
          headers: { Origin: "https://other.invalid" },
        }),
      ),
      false,
    );
    assert.equal(localLabRequestAllowed(new Request("http://example.com/api/laboratorio")), false);
    assert.equal(
      localLabRequestAllowed(
        new Request("http://localhost:3017/api/laboratorio", {
          method: "POST",
          headers: { Host: "127.0.0.1:3017", Origin: "http://127.0.0.1:3017" },
        }),
      ),
      true,
    );
    assert.equal(
      localLabRequestAllowed(
        new Request("http://localhost:3017/api/laboratorio", {
          method: "POST",
          headers: { Host: "example.com", Origin: "http://example.com" },
        }),
      ),
      false,
    );
    env.NODE_ENV = "production";
    assert.equal(
      localLabRequestAllowed(new Request("http://127.0.0.1:3017/api/laboratorio")),
      false,
    );
    env.NODE_ENV = "development";
    delete process.env.FIDERESTO_LOCAL_LAB;
    assert.equal(
      localLabRequestAllowed(new Request("http://127.0.0.1:3017/api/laboratorio")),
      false,
    );
  } finally {
    if (oldNode === undefined) delete env.NODE_ENV;
    else env.NODE_ENV = oldNode;
    if (oldLab === undefined) delete process.env.FIDERESTO_LOCAL_LAB;
    else process.env.FIDERESTO_LOCAL_LAB = oldLab;
  }
});

test("request body limit is enforced without trusting Content-Length", async () => {
  assert.deepEqual(
    await readSmallJson(new Request("http://localhost", { method: "POST", body: '{"paid":true}' })),
    { paid: true },
  );
  await assert.rejects(
    () =>
      readSmallJson(
        new Request("http://localhost", {
          method: "POST",
          headers: { "Content-Length": "1" },
          body: "x".repeat(8193),
        }),
      ),
    /BODY_TOO_LARGE/,
  );
});
