import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { z } from "zod";
import { supabaseConfig } from "@/lib/config";
import { Brand } from "@/components/brand";
import { Coffee } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function TagPage({ params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = await params;
  if (!z.uuid().safeParse(tagId).success) notFound();
  const config = supabaseConfig();
  if (!config) notFound();
  const client = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.rpc("public_tag", { tag_id: tagId });
  if (error || !data) notFound();
  return (
    <main className="center-page public-entry">
      <section className="panel">
        <Brand />
        <span className="icon-tile">
          <Coffee size={30} />
        </span>
        <span className="eyebrow">BIENVENIDO A</span>
        <h1>{data.name}</h1>
        <p>Con {data.stamp_target} sellos conseguirás:</p>
        <h2>{data.reward_text}</h2>
        <p>
          {data.minimum_spend_cents
            ? `Un sello por cuenta desde ${(data.minimum_spend_cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}.`
            : "Un sello por cuenta, sin consumo mínimo."}
        </p>
        <div className="notice">
          Estamos preparando el programa. El registro y la tarjeta Wallet todavía no están
          disponibles.
        </div>
        <small>Este enlace no añade sellos por sí solo.</small>
      </section>
    </main>
  );
}
