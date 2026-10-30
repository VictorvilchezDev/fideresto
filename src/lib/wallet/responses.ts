import { appleCredentials, googleCredentials } from "./config";
import { createApplePass } from "./apple";
import { issueGooglePass } from "./google";
import type { WalletSnapshot } from "./model";
export async function walletResponse(snapshot: WalletSnapshot, provider: string) {
  try {
    if (provider === "apple") {
      const credentials = await appleCredentials();
      if (!credentials) return Response.json({ error: "APPLE_NOT_CONFIGURED" }, { status: 503 });
      const pass = await createApplePass(snapshot, credentials);
      return new Response(new Uint8Array(pass), {
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Content-Disposition": 'attachment; filename="fideresto.pkpass"',
          "Cache-Control": "private, no-store",
          "Referrer-Policy": "no-referrer",
        },
      });
    }
    if (provider === "google") {
      const credentials = await googleCredentials();
      if (!credentials) return Response.json({ error: "GOOGLE_NOT_CONFIGURED" }, { status: 503 });
      return new Response(null, {
        status: 303,
        headers: {
          Location: await issueGooglePass(snapshot, credentials),
          "Cache-Control": "private, no-store",
          "Referrer-Policy": "no-referrer",
        },
      });
    }
    return new Response(null, { status: 404 });
  } catch {
    return Response.json(
      { error: "No se pudo emitir la tarjeta. Revisa la configuración del emisor." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
