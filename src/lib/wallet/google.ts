import { SignJWT, importPKCS8 } from "jose";
import type { GoogleCredentials } from "./config";
import { walletBarcode, walletIdentity, walletSnapshotSchema, type WalletSnapshot } from "./model";
export function googlePassIds(s: WalletSnapshot, c: GoogleCredentials) {
  return {
    classId: `${c.issuerId}.fideresto_${s.sample ? "sample_" : ""}${s.merchantId.replaceAll("-", "")}`,
    objectId: `${c.issuerId}.fideresto_${walletIdentity(s)}`,
  };
}
export function googlePassData(input: WalletSnapshot, c: GoogleCredentials) {
  const s = walletSnapshotSchema.parse(input),
    ids = googlePassIds(s, c);
  return {
    loyaltyClass: {
      id: ids.classId,
      issuerName: s.merchantName,
      programName: s.merchantName,
      programLogo: {
        sourceUri: { uri: c.logoUrl },
        contentDescription: {
          defaultValue: { language: "es", value: `Logotipo de ${s.merchantName}` },
        },
      },
      reviewStatus: "UNDER_REVIEW",
      hexBackgroundColor: "#edf3ff",
      countryCode: "ES",
    },
    loyaltyObject: {
      id: ids.objectId,
      classId: ids.classId,
      state: "ACTIVE",
      accountId: s.cardCode,
      loyaltyPoints: { label: "Sellos", balance: { string: `${s.stamps} / ${s.target}` } },
      barcode: { type: "QR_CODE", value: walletBarcode(s), alternateText: "Tarjeta de fidelidad" },
      textModulesData: [
        { id: "reward", header: "Próximo premio", body: s.rewardText },
        { id: "available", header: "Premios disponibles", body: String(s.availableRewards) },
        ...(s.sample
          ? [{ id: "sample", header: "PRUEBA", body: "Datos ficticios. No otorga premios reales." }]
          : []),
      ],
    },
  };
}
export async function googleSaveJwt(
  s: WalletSnapshot,
  c: GoogleCredentials,
  now = Math.floor(Date.now() / 1000),
) {
  const { objectId } = googlePassIds(s, c);
  return new SignJWT({
    origins: [new URL(c.publicOrigin).hostname],
    typ: "savetowallet",
    payload: { loyaltyObjects: [{ id: objectId }] },
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(c.email)
    .setAudience("google")
    .setIssuedAt(now)
    .setExpirationTime(now + 300)
    .sign(await importPKCS8(c.privateKey, "RS256"));
}
type Fetcher = typeof fetch;
async function googleAccessToken(c: GoogleCredentials, request: Fetcher) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/wallet_object.issuer",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(c.email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(await importPKCS8(c.privateKey, "RS256"));
  const response = await request("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(8000),
    redirect: "error",
  });
  if (!response.ok) throw new Error("GOOGLE_AUTH_FAILED");
  const data = await response.json();
  if (typeof data.access_token !== "string" || data.access_token.length > 8192)
    throw new Error("GOOGLE_AUTH_FAILED");
  return data.access_token as string;
}
export async function issueGooglePass(
  s: WalletSnapshot,
  c: GoogleCredentials,
  request: Fetcher = fetch,
) {
  const token = await googleAccessToken(c, request),
    { loyaltyClass, loyaltyObject } = googlePassData(s, c);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const api = "https://walletobjects.googleapis.com/walletobjects/v1";
  const options = { headers, signal: AbortSignal.timeout(8000), redirect: "error" as const };
  const currentClass = await request(`${api}/loyaltyClass/${loyaltyClass.id}`, options);
  if (currentClass.status === 404) {
    const created = await request(`${api}/loyaltyClass`, {
      ...options,
      method: "POST",
      body: JSON.stringify(loyaltyClass),
    });
    if (!created.ok && created.status !== 409) throw new Error("GOOGLE_CLASS_FAILED");
  } else if (!currentClass.ok) throw new Error("GOOGLE_CLASS_FAILED");
  const current = await request(`${api}/loyaltyObject/${loyaltyObject.id}`, options);
  if (current.ok) {
    const old = await current.json();
    if (old.classId !== loyaltyClass.id) throw new Error("GOOGLE_OBJECT_MISMATCH");
  } else if (current.status !== 404) throw new Error("GOOGLE_OBJECT_FAILED");
  let result = await request(
    current.ok ? `${api}/loyaltyObject/${loyaltyObject.id}` : `${api}/loyaltyObject`,
    { ...options, method: current.ok ? "PATCH" : "POST", body: JSON.stringify(loyaltyObject) },
  );
  if (result.status === 409 && !current.ok)
    result = await request(`${api}/loyaltyObject/${loyaltyObject.id}`, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(loyaltyObject),
    });
  if (!result.ok) throw new Error("GOOGLE_OBJECT_FAILED");
  return `https://pay.google.com/gp/v/save/${await googleSaveJwt(s, c)}`;
}
