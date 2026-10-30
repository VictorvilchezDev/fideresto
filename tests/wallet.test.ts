import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash, generateKeyPairSync } from "node:crypto";
import { unzipSync } from "fflate";
import { jwtVerify } from "jose";
import { createApplePass } from "../src/lib/wallet/apple";
import {
  validateAppleCredentials,
  walletPublicOrigin,
  walletReadiness,
} from "../src/lib/wallet/config";
import {
  googlePassData,
  googlePassIds,
  googleSaveJwt,
  issueGooglePass,
} from "../src/lib/wallet/google";
import { sampleCard, walletIdentity, walletBarcode } from "../src/lib/wallet/model";
import { newDeliveryToken, deliveryHash } from "../src/lib/wallet/delivery";

test("Apple package has verified detached signature, manifest and stable card identity", async () => {
  const dir = await mkdtemp(join(tmpdir(), "fideresto-signature-test-"));
  const openssl = (...args: string[]) =>
    execFileSync("openssl", args, { cwd: dir, stdio: "ignore" });
  try {
    await writeFile(
      join(dir, "ca.cnf"),
      "[req]\ndistinguished_name=dn\nx509_extensions=ca\nprompt=no\n[dn]\nCN=Fideresto TEST CA\n[ca]\nbasicConstraints=critical,CA:TRUE\nkeyUsage=critical,keyCertSign,cRLSign\n",
    );
    await writeFile(
      join(dir, "leaf.cnf"),
      "basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature\n",
    );
    openssl(
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      "ca.key",
      "-out",
      "ca.pem",
      "-days",
      "2",
      "-config",
      "ca.cnf",
    );
    openssl(
      "req",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      "leaf.key",
      "-out",
      "leaf.csr",
      "-subj",
      "/UID=pass.test.fideresto/OU=TESTTEAM01/CN=Fideresto TEST signer",
    );
    openssl(
      "x509",
      "-req",
      "-in",
      "leaf.csr",
      "-CA",
      "ca.pem",
      "-CAkey",
      "ca.key",
      "-CAcreateserial",
      "-out",
      "leaf.pem",
      "-days",
      "1",
      "-extfile",
      "leaf.cnf",
    );
    const c = validateAppleCredentials({
      passTypeId: "pass.test.fideresto",
      teamId: "TESTTEAM01",
      signerCert: await readFile(join(dir, "leaf.pem")),
      signerKey: await readFile(join(dir, "leaf.key")),
      wwdr: await readFile(join(dir, "ca.pem")),
    });
    assert.throws(() => validateAppleCredentials({ ...c, teamId: "WRONGTEAM1" }), /ID_MISMATCH/);
    assert.throws(() => validateAppleCredentials({ ...c, signerKey: c.wwdr }), /./);
    const entries = unzipSync(await createApplePass(sampleCard, c));
    const pass = JSON.parse(Buffer.from(entries["pass.json"]).toString());
    assert.equal(pass.serialNumber, walletIdentity(sampleCard));
    assert.equal(pass.passTypeIdentifier, c.passTypeId);
    assert.equal(pass.storeCard.primaryFields[0].value, "5 / 8");
    assert.equal(pass.barcodes[0].message, walletBarcode(sampleCard));
    assert.equal(pass.webServiceURL, undefined); // Automatic refresh is a separate, unfinished integration.
    assert.ok(entries["icon@3x.png"] && entries["strip@2x.png"]);
    const manifest = JSON.parse(Buffer.from(entries["manifest.json"]).toString());
    for (const [name, hash] of Object.entries(manifest))
      assert.equal(createHash("sha1").update(entries[name]).digest("hex"), hash, name);
    await writeFile(join(dir, "manifest.json"), entries["manifest.json"]);
    await writeFile(join(dir, "signature"), entries.signature);
    openssl(
      "smime",
      "-verify",
      "-inform",
      "DER",
      "-in",
      "signature",
      "-content",
      "manifest.json",
      "-CAfile",
      "ca.pem",
      "-out",
      "verified.json",
    );
    await writeFile(join(dir, "manifest.json"), "tampered");
    assert.throws(() =>
      openssl(
        "smime",
        "-verify",
        "-inform",
        "DER",
        "-in",
        "signature",
        "-content",
        "manifest.json",
        "-CAfile",
        "ca.pem",
        "-out",
        "verified.json",
      ),
    );
    assert.equal(
      walletIdentity({ ...sampleCard, stamps: 7, rewardText: "Nuevo premio" }),
      walletIdentity(sampleCard),
    );
    assert.notEqual(walletIdentity({ ...sampleCard, sample: false }), walletIdentity(sampleCard));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

const pair = generateKeyPairSync("rsa", { modulusLength: 2048 });
const google = {
  issuerId: "123456789",
  email: "wallet@fideresto-test.iam.gserviceaccount.com",
  privateKey: pair.privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
  publicOrigin: "https://wallet.example.test",
  logoUrl: "https://wallet.example.test/wallet-assets/logo.png",
};
test("Google Save JWT signature, scope and merchant identities are bounded", async () => {
  const jwt = await googleSaveJwt(sampleCard, google);
  const { payload } = await jwtVerify(jwt, pair.publicKey, {
    issuer: google.email,
    audience: "google",
    algorithms: ["RS256"],
  });
  assert.equal(Number(payload.exp) - Number(payload.iat), 300);
  assert.equal(payload.typ, "savetowallet");
  assert.deepEqual(payload.payload, {
    loyaltyObjects: [{ id: googlePassIds(sampleCard, google).objectId }],
  });
  assert.ok(jwt.length < 1800);
  const data = googlePassData(sampleCard, google);
  assert.equal(data.loyaltyObject.loyaltyPoints.balance.string, "5 / 8");
  assert.equal(data.loyaltyObject.barcode.value, walletBarcode(sampleCard));
  assert.doesNotMatch(JSON.stringify(data), /phone|birthday|profile/);
  assert.notEqual(
    googlePassIds({ ...sampleCard, merchantId: "20000000-0000-4000-8000-000000000002" }, google)
      .objectId,
    googlePassIds(sampleCard, google).objectId,
  );
});
test("Google issuance creates once, updates same object and fails closed on provider errors", async () => {
  for (const exists of [false, true]) {
    const calls: { url: string; method: string; body?: string }[] = [];
    const mock: typeof fetch = async (input, init) => {
      const url = String(input),
        method = init?.method ?? "GET";
      calls.push({ url, method, body: init?.body?.toString() });
      assert.equal(init?.redirect, "error");
      if (url === "https://oauth2.googleapis.com/token") {
        const params = new URLSearchParams(String(init?.body));
        const { payload } = await jwtVerify(params.get("assertion")!, pair.publicKey, {
          audience: url,
          issuer: google.email,
        });
        assert.equal(payload.scope, "https://www.googleapis.com/auth/wallet_object.issuer");
        return Response.json({ access_token: "test-token" });
      }
      assert.equal(new URL(url).hostname, "walletobjects.googleapis.com");
      if (method === "GET")
        return exists
          ? Response.json({ classId: googlePassIds(sampleCard, google).classId })
          : new Response(null, { status: 404 });
      return Response.json({});
    };
    assert.match(
      await issueGooglePass(sampleCard, google, mock),
      /^https:\/\/pay.google.com\/gp\/v\/save\//,
    );
    assert.equal(calls.at(-1)?.method, exists ? "PATCH" : "POST");
    assert.equal(JSON.parse(calls.at(-1)!.body!).loyaltyPoints.balance.string, "5 / 8");
    assert.equal(
      calls.filter((c) => c.method === "POST" && c.url.endsWith("/loyaltyClass")).length,
      exists ? 0 : 1,
    );
  }
  await assert.rejects(
    () => issueGooglePass(sampleCard, google, async () => new Response(null, { status: 401 })),
    /GOOGLE_AUTH_FAILED/,
  );
  const wrongClass: typeof fetch = async (input) =>
    String(input).includes("oauth2")
      ? Response.json({ access_token: "test-token" })
      : Response.json({ classId: "another.class" });
  await assert.rejects(
    () => issueGooglePass(sampleCard, google, wrongClass),
    /GOOGLE_OBJECT_MISMATCH/,
  );
});
test("delivery capabilities are random, hashed and reject malformed tokens", () => {
  const a = newDeliveryToken(),
    b = newDeliveryToken();
  assert.equal(a.length, 43);
  assert.notEqual(a, b);
  assert.match(deliveryHash(a), /^[0-9a-f]{64}$/);
  assert.notEqual(deliveryHash(a), deliveryHash(b));
  assert.throws(() => deliveryHash("../bad"), /INVALID/);
});
test("public Wallet origin rejects unsafe URLs and missing credentials stay unavailable", async () => {
  const keys = Object.keys(process.env).filter(
    (k) =>
      k.startsWith("APPLE_WALLET_") ||
      k.startsWith("GOOGLE_WALLET_") ||
      k === "WALLET_PUBLIC_ORIGIN",
  );
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  try {
    for (const key of keys) delete process.env[key];
    const status = await walletReadiness();
    assert.equal(status.apple.ready, false);
    assert.equal(status.google.ready, false);
    for (const value of [
      "http://example.test",
      "https://localhost",
      "https://127.0.0.1",
      "https://wallet.test/path",
      "https://user:password@wallet.test",
    ]) {
      process.env.WALLET_PUBLIC_ORIGIN = value;
      assert.throws(() => walletPublicOrigin());
    }
    process.env.WALLET_PUBLIC_ORIGIN = "https://wallet.example.test";
    assert.equal(walletPublicOrigin(), "https://wallet.example.test");
  } finally {
    delete process.env.WALLET_PUBLIC_ORIGIN;
    for (const [key, value] of Object.entries(saved)) process.env[key] = value;
  }
});
