import { Brand } from "@/components/brand";
import { PassPreview } from "@/components/wallet/pass-preview";
import { AddWalletButtons } from "@/components/wallet/add-buttons";
import { walletReadiness } from "@/lib/wallet/config";
import { sampleCard } from "@/lib/wallet/model";
export const dynamic = "force-dynamic";
export default async function QrConnectionPage() {
  const status = await walletReadiness();
  return (
    <main className="wallet-entry">
      <Brand />
      <span className="eyebrow">PRUEBA DE TARJETA DIGITAL</span>
      <h1>De aquí, a tu Wallet.</h1>
      <p>La misma tarjeta, en iPhone y Android. Sin instalar una app de Fideresto.</p>
      <PassPreview card={sampleCard} />
      <AddWalletButtons
        status={status}
        base="/api/wallet/sample"
        enabled={process.env.FIDERESTO_WALLET_SAMPLE === "1"}
      />
      {(!status.apple.ready || !status.google.ready) && (
        <aside className="panel wallet-setup-note">
          <h2>Falta conectar las cuentas emisoras</h2>
          <p>
            El diseño y los generadores están preparados. Para instalar una tarjeta real necesitamos
            el certificado de Apple Developer y la cuenta emisora de Google Wallet.
          </p>
          <p>
            Esta prueba usa datos ficticios. No registra clientes ni suma sellos a un
            establecimiento real.
          </p>
        </aside>
      )}
      <p className="wallet-footnote">
        Vista previa y entrega de prueba. El alta por teléfono verificado y la actualización
        automática de pases aún están pendientes de conexión y pruebas.
      </p>
    </main>
  );
}
