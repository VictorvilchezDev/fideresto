import { walletLogo } from "@/lib/wallet/assets";
export async function GET() {
  return new Response(new Uint8Array(await walletLogo()), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
}
