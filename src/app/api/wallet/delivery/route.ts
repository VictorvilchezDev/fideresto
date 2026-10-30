import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { appOrigin, supabaseConfig } from "@/lib/config";
import { walletPublicOrigin } from "@/lib/wallet/config";
import { deliveryHash, newDeliveryToken } from "@/lib/wallet/delivery";
import { readSmallJson } from "@/lib/loyalty/request";
import { loyaltyError } from "@/lib/loyalty/types";
export async function POST(req: Request) {
  if (req.headers.get("origin") !== appOrigin()) return new Response(null, { status: 403 });
  if (!supabaseConfig())
    return NextResponse.json(
      { error: "Primero hay que conectar Supabase y verificar el móvil del cliente." },
      { status: 503 },
    );
  try {
    const input = z
      .object({ merchant: z.uuid(), card: z.uuid() })
      .safeParse(await readSmallJson(req));
    if (!input.success) return new Response(null, { status: 400 });
    const origin = walletPublicOrigin();
    if (!origin)
      return NextResponse.json(
        { error: "Primero hay que configurar la dirección HTTPS pública de entrega." },
        { status: 503 },
      );
    const client = await supabase();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user) return new Response(null, { status: 401 });
    const token = newDeliveryToken();
    const result = await client.rpc("create_wallet_delivery", {
      p_merchant: input.data.merchant,
      p_card: input.data.card,
      p_token_hash: deliveryHash(token),
    });
    if (result.error)
      return NextResponse.json(
        {
          error:
            result.error.message === "WALLET_DELIVERY_LIMIT"
              ? "Ya hay varios enlaces vigentes. Espera a que caduquen antes de crear otro."
              : loyaltyError(result.error.message),
        },
        { status: 400 },
      );
    return NextResponse.json(
      { url: `${origin}/wallet/${token}`, expiresAt: result.data },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "No se ha podido preparar la entrega Wallet." },
      { status: 400 },
    );
  }
}
