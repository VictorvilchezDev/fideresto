import { readFile, stat } from "node:fs/promises";
import { createPrivateKey, X509Certificate } from "node:crypto";
import { z } from "zod";
import { isLoopbackOrigin } from "../qr-links";
export function walletPublicOrigin() {
  const raw = process.env.WALLET_PUBLIC_ORIGIN;
  if (!raw) return null;
  const u = new URL(raw);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    u.pathname !== "/" ||
    u.search ||
    u.hash ||
    isLoopbackOrigin(u.origin) ||
    /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)
  )
    throw new Error("WALLET_PUBLIC_ORIGIN_INVALID");
  return u.origin;
}
async function file(p: string) {
  const info = await stat(p);
  if (!info.isFile() || info.size > 65536) throw new Error("WALLET_FILE_INVALID");
  return readFile(p);
}
export type AppleCredentials = {
  passTypeId: string;
  teamId: string;
  signerCert: Buffer;
  signerKey: Buffer;
  wwdr: Buffer;
  signerKeyPassphrase?: string;
};
export function validateAppleCredentials(c: AppleCredentials) {
  const cert = new X509Certificate(c.signerCert),
    wwdr = new X509Certificate(c.wwdr);
  const key = createPrivateKey({ key: c.signerKey, passphrase: c.signerKeyPassphrase });
  const now = Date.now();
  if (
    key.asymmetricKeyType !== "rsa" ||
    (key.asymmetricKeyDetails?.modulusLength ?? 0) < 2048 ||
    !wwdr.ca ||
    cert.ca ||
    !cert.checkPrivateKey(key) ||
    new Date(cert.validFrom).getTime() > now ||
    new Date(cert.validTo).getTime() <= now ||
    new Date(wwdr.validTo).getTime() <= now ||
    new Date(wwdr.validFrom).getTime() > now ||
    !cert.verify(wwdr.publicKey)
  )
    throw new Error("APPLE_CERTIFICATE_INVALID");
  const fields = Object.fromEntries(
    cert.subject.split("\n").map((v) => {
      const n = v.indexOf("=");
      return [v.slice(0, n), v.slice(n + 1)];
    }),
  );
  if (fields.UID !== c.passTypeId || fields.OU !== c.teamId)
    throw new Error("APPLE_CERTIFICATE_ID_MISMATCH");
  return c;
}
export async function appleCredentials(): Promise<AppleCredentials | null> {
  const e = process.env;
  const paths = [
    e.APPLE_WALLET_SIGNER_CERT_FILE,
    e.APPLE_WALLET_SIGNER_KEY_FILE,
    e.APPLE_WALLET_WWDR_FILE,
  ];
  if (!e.APPLE_WALLET_PASS_TYPE_ID || !e.APPLE_WALLET_TEAM_ID || paths.some((v) => !v)) return null;
  if (
    !/^pass\.[a-zA-Z0-9.-]{3,180}$/.test(e.APPLE_WALLET_PASS_TYPE_ID) ||
    !/^[A-Z0-9]{10}$/.test(e.APPLE_WALLET_TEAM_ID)
  )
    throw new Error("APPLE_IDS_INVALID");
  const [signerCert, signerKey, wwdr] = await Promise.all(paths.map((p) => file(p!)));
  return validateAppleCredentials({
    passTypeId: e.APPLE_WALLET_PASS_TYPE_ID,
    teamId: e.APPLE_WALLET_TEAM_ID,
    signerCert,
    signerKey,
    wwdr,
    signerKeyPassphrase: e.APPLE_WALLET_KEY_PASSPHRASE,
  });
}
const serviceSchema = z.object({
  type: z.literal("service_account"),
  client_email: z.email().endsWith(".gserviceaccount.com"),
  private_key: z.string().min(100).max(16000),
});
export type GoogleCredentials = {
  issuerId: string;
  email: string;
  privateKey: string;
  publicOrigin: string;
  logoUrl: string;
};
export async function googleCredentials(): Promise<GoogleCredentials | null> {
  const e = process.env;
  const publicOrigin = walletPublicOrigin();
  if (!e.GOOGLE_WALLET_ISSUER_ID || !e.GOOGLE_WALLET_CREDENTIALS_FILE || !publicOrigin) return null;
  if (!/^\d{6,30}$/.test(e.GOOGLE_WALLET_ISSUER_ID)) throw new Error("GOOGLE_ISSUER_INVALID");
  const parsed = serviceSchema.parse(
    JSON.parse((await file(e.GOOGLE_WALLET_CREDENTIALS_FILE)).toString("utf8")),
  );
  const key = createPrivateKey(parsed.private_key);
  if (key.asymmetricKeyType !== "rsa" || (key.asymmetricKeyDetails?.modulusLength ?? 0) < 2048)
    throw new Error("GOOGLE_KEY_INVALID");
  return {
    issuerId: e.GOOGLE_WALLET_ISSUER_ID,
    email: parsed.client_email,
    privateKey: parsed.private_key,
    publicOrigin,
    logoUrl: `${publicOrigin}/wallet-assets/logo.png`,
  };
}
export type WalletReadiness = {
  apple: { ready: boolean; message: string };
  google: { ready: boolean; message: string };
  publicOrigin: boolean;
};
export async function walletReadiness(): Promise<WalletReadiness> {
  const [a, g] = await Promise.allSettled([appleCredentials(), googleCredentials()]);
  let origin = false;
  try {
    origin = !!walletPublicOrigin();
  } catch {}
  return {
    apple: {
      ready: a.status === "fulfilled" && !!a.value,
      message:
        a.status === "rejected"
          ? "Revisar certificado, clave e identificadores de Apple."
          : a.value
            ? "Firma preparada; pendiente comprobar instalación real."
            : "Faltan certificado Pass Type ID y clave de Apple Developer.",
    },
    google: {
      ready: g.status === "fulfilled" && !!g.value,
      message:
        g.status === "rejected"
          ? "Revisar emisor, cuenta de servicio y dirección HTTPS."
          : g.value
            ? "Firma preparada; pendiente comprobar emisor y dispositivo."
            : "Faltan cuenta emisora, credenciales de Google y dirección HTTPS pública.",
    },
    publicOrigin: origin,
  };
}
