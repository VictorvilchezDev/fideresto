import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { supabaseConfig, appOrigin } from "@/lib/config";
import { commandSchema, readSmallJson } from "@/lib/loyalty/request";
import { loyaltyError } from "@/lib/loyalty/types";
export async function POST(req: Request) {
  if (!supabaseConfig())
    return NextResponse.json({ error: "Supabase está pendiente de conexión." }, { status: 503 });
  if (req.headers.get("origin") !== appOrigin()) return new Response(null, { status: 403 });
  try {
    const raw = await readSmallJson(req);
    const input = z
      .object({
        merchant: z.uuid(),
        card: z.uuid(),
        command: commandSchema.omit({ merchant: true, card: true }).optional(),
      })
      .safeParse(raw);
    if (!input.success) return NextResponse.json({ error: "Revisa los datos." }, { status: 400 });
    const client = await supabase();
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();
    if (authError || !user) return new Response(null, { status: 401 });
    const { merchant, card, command } = input.data;
    const { data: membership } = await client
      .from("memberships")
      .select("role")
      .eq("merchant_id", merchant)
      .eq("user_id", user.id)
      .maybeSingle();
    if (command) {
      const { error } = await client.rpc("loyalty_command", {
        p_merchant: merchant,
        p_card: card,
        p_action: command.action,
        p_key: command.key,
        p_payload: command.payload,
      });
      if (error) throw error;
    }
    const { data, error } = await client.rpc("loyalty_card", {
      p_merchant: merchant,
      p_card: card,
    });
    if (error) throw error;
    return NextResponse.json(
      { card: data, role: membership?.role ?? "consumer" },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "BODY_TOO_LARGE")
      return new Response(null, { status: 413 });
    const message =
      error && typeof error === "object" && "message" in error ? String(error.message) : "";
    return NextResponse.json(
      { error: loyaltyError(message) },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
