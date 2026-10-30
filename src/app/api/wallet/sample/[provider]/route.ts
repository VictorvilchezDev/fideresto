import { sampleCard } from "@/lib/wallet/model";
import { walletResponse } from "@/lib/wallet/responses";
export const runtime = "nodejs";
export async function GET(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
  if (process.env.FIDERESTO_WALLET_SAMPLE !== "1") return new Response(null, { status: 404 });
  const { provider } = await params;
  return walletResponse(sampleCard, provider);
}
