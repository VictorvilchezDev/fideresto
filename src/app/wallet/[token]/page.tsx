import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { walletDelivery } from "@/lib/wallet/delivery";
import { walletReadiness } from "@/lib/wallet/config";
import { Brand } from "@/components/brand";
import { PassPreview } from "@/components/wallet/pass-preview";
import { AddWalletButtons } from "@/components/wallet/add-buttons";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};
export default async function WalletDeliveryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const snapshot = await walletDelivery(token);
  if (!snapshot) notFound();
  return (
    <main className="wallet-entry">
      <Brand />
      <span className="eyebrow">TU TARJETA DIGITAL</span>
      <h1>Llévala contigo.</h1>
      <p>Añádela al Wallet de tu móvil. No necesitas una cuenta ni una app de Fideresto.</p>
      <PassPreview card={snapshot} />
      <AddWalletButtons status={await walletReadiness()} base={`/wallet/${token}`} />
      <p className="wallet-footnote">
        Este enlace privado caduca a los 15 minutos de su creación. Si ha caducado, pide otro al
        establecimiento.
      </p>
    </main>
  );
}
