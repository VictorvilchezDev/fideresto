import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("database enforces tenant isolation and role permissions", { timeout: 30000 }, async () => {
  const db = new PGlite();
  try {
    await db.exec(await readFile("supabase/tests/bootstrap-local.sql", "utf8"));
    await db.exec(await readFile("supabase/migrations/202610300001_foundation.sql", "utf8"));
    const results = await db.exec(await readFile("supabase/tests/foundation.sql", "utf8"));
    assert.equal(
      (results.at(-1)?.rows[0] as { result: string }).result,
      "Foundation RLS tests passed",
    );
  } finally {
    await db.close();
  }
});
