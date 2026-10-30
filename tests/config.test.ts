import { test } from "node:test";
import assert from "node:assert/strict";
import { appOrigin, supabaseConfig } from "../src/lib/config";
test("rejects a privileged Supabase key and unsafe origins", () => {
  const old = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    origin: process.env.NEXT_PUBLIC_APP_URL,
  };
  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_secret_fictitious";
    assert.throws(supabaseConfig, /publishable/);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fictitious";
    assert.equal(supabaseConfig()?.url, "https://example.supabase.co");
    for (const origin of [
      "http://example.com",
      "https://user:password@example.com",
      "https://example.com/path",
      "https://example.com?key=value",
    ]) {
      process.env.NEXT_PUBLIC_APP_URL = origin;
      assert.throws(appOrigin);
    }
    process.env.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3017";
    assert.equal(appOrigin(), "http://127.0.0.1:3017");
  } finally {
    for (const [key, value] of Object.entries({
      NEXT_PUBLIC_SUPABASE_URL: old.url,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: old.key,
      NEXT_PUBLIC_APP_URL: old.origin,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
