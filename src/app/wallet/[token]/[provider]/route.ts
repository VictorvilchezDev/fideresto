import { walletDelivery } from "@/lib/wallet/delivery";
import { walletResponse } from "@/lib/wallet/responses";
export const runtime = "nodejs";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string; provider: string }> },
) {
  const { token, provider } = await params;
  if (!["apple", "google"].includes(provider)) return new Response(null, { status: 404 });
  const snapshot = await walletDelivery(token);
  if (!snapshot)
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  return walletResponse(snapshot, provider);
}
