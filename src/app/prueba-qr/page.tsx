import { Brand } from "@/components/brand";
import { Check, QrCode } from "lucide-react";
export default function QrConnectionPage() {
  return (
    <main className="center-page public-entry">
      <section className="panel qr-connection">
        <Brand />
        <span className="icon-tile">
          <QrCode size={30} />
        </span>
        <span className="eyebrow">PRUEBA DE CONEXIÓN</span>
        <h1>El QR ya abre en tu móvil.</h1>
        <p>Has llegado al acceso de demostración de Fideresto.</p>
        <div className="notice">
          <Check size={18} />
          <span>Enlace abierto correctamente.</span>
        </div>
        <h2>La tarjeta Wallet es el siguiente paso.</h2>
        <p>
          El registro, la verificación del teléfono y la creación de la tarjeta todavía no están
          disponibles. Esta pantalla solo comprueba que puedes abrir el enlace.
        </p>
        <small>No se han registrado datos ni añadido sellos.</small>
      </section>
    </main>
  );
}
