import { test } from "node:test";
import assert from "node:assert/strict";
import { appOrigin, supabaseConfig, demoQrOrigin } from "../src/lib/config";
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

test("fictitious QR allows an explicitly enabled LAN origin without weakening app origin", () => {
  const originalDemo = process.env.FIDERESTO_DEMO_QR_ORIGIN,
    originalLan = process.env.FIDERESTO_LAN_PREVIEW,
    originalApp = process.env.NEXT_PUBLIC_APP_URL;
  try {
    process.env.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3017";
    process.env.FIDERESTO_DEMO_QR_ORIGIN = "http://192.168.1.20:3019";
    delete process.env.FIDERESTO_LAN_PREVIEW;
    assert.throws(demoQrOrigin);
    process.env.FIDERESTO_LAN_PREVIEW = "1";
    assert.equal(demoQrOrigin(), "http://192.168.1.20:3019");
    assert.equal(appOrigin(), "http://127.0.0.1:3017");
    for (const origin of [
      "http://example.com",
      "http://127.0.0.1:3019",
      "http://192.168.999.1:3019",
      "http://192.168.1.2/path",
      "https://user:password@example.com",
    ]) {
      process.env.FIDERESTO_DEMO_QR_ORIGIN = origin;
      assert.throws(demoQrOrigin);
    }
    process.env.FIDERESTO_DEMO_QR_ORIGIN = "https://preview.example.com";
    assert.equal(demoQrOrigin(), "https://preview.example.com");
  } finally {
    for (const [key, value] of Object.entries({
      FIDERESTO_DEMO_QR_ORIGIN: originalDemo,
      FIDERESTO_LAN_PREVIEW: originalLan,
      NEXT_PUBLIC_APP_URL: originalApp,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

import { isLoopbackOrigin, tagEntryLink } from "../src/lib/qr-links";
test("QR links use the public connection test and detect unusable phone targets", () => {
  for (const origin of [
    "http://localhost:3017",
    "http://127.0.0.1:3017",
    "http://127.2.3.4",
    "http://[::1]:3017",
    "http://0.0.0.0:3017",
  ])
    assert.equal(isLoopbackOrigin(origin), true);
  assert.equal(isLoopbackOrigin("http://192.168.1.20:3019"), false);
  assert.equal(
    tagEntryLink("http://192.168.1.20:3019", "demo", true),
    "http://192.168.1.20:3019/prueba-qr",
  );
  assert.equal(
    tagEntryLink("https://app.example.com", "tag-id", false),
    "https://app.example.com/t/tag-id",
  );
});
