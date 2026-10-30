export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const parsed = new URL(url);
  const local = ["localhost", "127.0.0.1"].includes(parsed.hostname);
  if (
    (!local && parsed.protocol !== "https:") ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("Configura una URL de proyecto Supabase válida.");
  }
  if (!key.startsWith("sb_publishable_"))
    throw new Error(
      "Utiliza una clave publishable de Supabase; no una clave secret o service_role.",
    );
  return { url: parsed.origin, key };
}

export function appOrigin() {
  const url = new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const local = ["localhost", "127.0.0.1"].includes(url.hostname);
  if (
    (!local && url.protocol !== "https:") ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error("NEXT_PUBLIC_APP_URL debe ser un origen HTTPS sin ruta ni credenciales.");
  }
  return url.origin;
}

// Separate origin for the fictitious QR connection test. Auth/NFC production
// URLs still use appOrigin(), which keeps its HTTPS requirement.
export function demoQrOrigin() {
  const configured = process.env.FIDERESTO_DEMO_QR_ORIGIN;
  if (!configured) return appOrigin();
  const url = new URL(configured);
  const octets = url.hostname.split(".").map(Number);
  const privateIPv4 =
    /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) &&
    octets.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) &&
    (octets[0] === 10 ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && octets[1] === 168));
  const lanPreview =
    process.env.FIDERESTO_LAN_PREVIEW === "1" && privateIPv4 && url.protocol === "http:";
  if (
    (!lanPreview && url.protocol !== "https:") ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "El QR de prueba necesita HTTPS o una IPv4 privada con FIDERESTO_LAN_PREVIEW=1.",
    );
  }
  return url.origin;
}
