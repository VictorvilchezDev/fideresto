import { notFound } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/access";
import { LoyaltyWorkbench } from "@/components/loyalty-workbench";
import type { Card } from "@/lib/loyalty/types";
export default async function CardPage({ params }: { params: Promise<{ merchantId: string }> }) {
  const { merchantId } = await params;
  if (!z.uuid().safeParse(merchantId).success) notFound();
  const { client } = await requireUser();
  const { data, error } = await client.rpc("loyalty_card", { p_merchant: merchantId });
  if (error || !data)
    return (
      <main className="simple-page">
        <h1>Tu tarjeta todavía no está activa</h1>
        <p>
          Primero tendrás que verificar el móvil. La conexión del servicio de verificación sigue
          pendiente.
        </p>
      </main>
    );
  return (
    <LoyaltyWorkbench merchant={merchantId} initial={{ card: data as Card, role: "consumer" }} />
  );
}
