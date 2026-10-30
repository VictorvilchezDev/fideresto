import { NextResponse } from "next/server";
import { labRequestSchema, localLabRequestAllowed, readSmallJson } from "@/lib/loyalty/request";
import { loyaltyError } from "@/lib/loyalty/types";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (!localLabRequestAllowed(req)) return new Response(null, { status: 404 });
  if (Number(req.headers.get("content-length")) > 8192) return new Response(null, { status: 413 });
  try {
    const input = labRequestSchema.safeParse(await readSmallJson(req));
    if (!input.success) return NextResponse.json({ error: "Revisa los datos." }, { status: 400 });
    const { localLab } = await import("@/lib/loyalty/local-lab");
    return NextResponse.json(await localLab(input.data), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "BODY_TOO_LARGE")
      return new Response(null, { status: 413 });
    return NextResponse.json(
      { error: loyaltyError(error instanceof Error ? error.message : "") },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
