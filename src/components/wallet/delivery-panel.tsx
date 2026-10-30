"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { Wallet, QrCode } from "lucide-react";
export function WalletDeliveryPanel({
  merchant,
  card,
  verified,
  lab,
}: {
  merchant?: string;
  card: string;
  verified: boolean;
  lab: boolean;
}) {
  const [result, setResult] = useState<{ url: string; expiresAt: string; qr: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="panel wallet-delivery-panel">
      <div>
        <span className="eyebrow">LA TARJETA, EN SU MÓVIL</span>
        <h2>
          <Wallet size={20} />
          Apple Wallet y Google Wallet
        </h2>
        <p>
          Prepara un enlace privado para que el cliente añada su tarjeta. El teléfono debe estar
          verificado.
        </p>
      </div>
      {lab ? (
        <p>
          La emisión real necesita Supabase y las cuentas emisoras.{" "}
          <a href="/prueba-qr" className="text-button">
            Ver tarjeta de prueba
          </a>
        </p>
      ) : (
        <button
          disabled={busy || !verified}
          onClick={async () => {
            setBusy(true);
            setError("");
            setResult(null);
            try {
              const response = await fetch("/api/wallet/delivery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ merchant, card }),
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.error ?? "No se pudo preparar el enlace.");
              setResult({
                ...data,
                qr: await QRCode.toDataURL(data.url, { width: 320, margin: 3 }),
              });
            } catch (e) {
              setError(e instanceof Error ? e.message : "No se pudo crear el enlace.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <QrCode size={16} />
          {busy ? "Preparando…" : "Preparar entrega Wallet"}
        </button>
      )}
      {!verified && !lab && <p>Primero hay que verificar el teléfono actual del cliente.</p>}
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="qr-preview">
          <img
            src={result.qr}
            width={240}
            height={240}
            alt="QR privado para añadir la tarjeta a Wallet"
          />
          <div>
            <p>Enlace privado, válido 15 minutos.</p>
            <a className="button secondary" href={result.url}>
              Abrir entrega
            </a>
            <p className="wallet-footnote">
              Caduca: {new Date(result.expiresAt).toLocaleTimeString("es-ES")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
