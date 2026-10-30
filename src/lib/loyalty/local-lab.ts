import "server-only";
import { readFile, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import type { z } from "zod";
import { localLabEnabled, labRequestSchema } from "./request";
import type { Card, LoyaltyResponse } from "./types";
const merchant = "20000000-0000-4000-8000-000000000001";
const alex = "30000000-0000-4000-8000-000000000001";
const actors = {
  owner: "10000000-0000-4000-8000-000000000001",
  staff: "10000000-0000-4000-8000-000000000002",
  consumer: "10000000-0000-4000-8000-000000000003",
};
type LabState = { db: Promise<PGlite>; tail: Promise<unknown> };
const globalLab = globalThis as typeof globalThis & { fiderestoLab?: LabState };
async function openLab() {
  // This module is never a production database adapter or authentication provider.
  if (!localLabEnabled()) throw new Error("LAB_DISABLED");
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = path.join(process.cwd(), ".data", "loyalty-lab-v1");
  await mkdir(dir, { recursive: true });
  const db = new PGlite(dir);
  const existing = await db.query<{ table_name: string | null }>(
    "select to_regclass('public.loyalty_customers')::text as table_name",
  );
  if (!existing.rows[0].table_name) {
    await db.exec(await readFile("supabase/tests/bootstrap-local.sql", "utf8"));
    for (const file of (await readdir("supabase/migrations"))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile(path.join("supabase/migrations", file), "utf8"));
    await db.exec(await readFile("supabase/tests/loyalty-fixtures.sql", "utf8"));
  }
  return db;
}
export async function localLab(input: z.infer<typeof labRequestSchema>): Promise<LoyaltyResponse> {
  if (!localLabEnabled()) throw new Error("LAB_DISABLED");
  const state = (globalLab.fiderestoLab ??= { db: openLab(), tail: Promise.resolve() });
  const run = state.tail.then(async () => {
    const db = await state.db;
    return db.transaction(async (tx) => {
      await tx.exec("set local role authenticated");
      await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [actors[input.persona]]);
      const card = input.card ?? alex;
      if (input.program) {
        const p = input.program;
        const result = await tx.query(
          "update public.programs set stamp_target=$1,reward_text=$2,minimum_spend_cents=$3,stamp_expiry_days=$4,reward_expiry_days=$5 where merchant_id=$6 returning merchant_id",
          [
            p.stamp_target,
            p.reward_text,
            p.minimum_spend_cents,
            p.stamp_expiry_days,
            p.reward_expiry_days,
            merchant,
          ],
        );
        if (!result.rows.length) throw new Error("OWNER_REQUIRED");
      }
      if (input.command) {
        const c = input.command;
        await tx.query("select public.loyalty_command($1,$2,$3,$4,$5::jsonb)", [
          merchant,
          card,
          c.action,
          c.key,
          JSON.stringify(c.payload),
        ]);
      }
      const result = await tx.query<{ card: Card }>("select public.loyalty_card($1,$2) as card", [
        merchant,
        card,
      ]);
      return {
        card: result.rows[0].card,
        role: input.persona,
        roster:
          input.persona === "consumer"
            ? undefined
            : [
                { name: "Alex", card_code: alex },
                { name: "Mar", card_code: "30000000-0000-4000-8000-000000000002" },
              ],
      };
    });
  });
  // Serialize connection-local synthetic identities; a failure does not poison the queue.
  state.tail = run.catch(() => {});
  return run;
}
