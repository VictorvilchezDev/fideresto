import { NextResponse } from "next/server";
import { walletReadiness } from "@/lib/wallet/config";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json(await walletReadiness(), { headers: { "Cache-Control": "no-store" } });
}
