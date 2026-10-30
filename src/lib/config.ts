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
