"use client";
import { useActionState, useState, type Dispatch, type SetStateAction } from "react";
import QRCode from "qrcode";
import { isLoopbackOrigin, tagEntryLink } from "@/lib/qr-links";
import { Copy, Radio, QrCode, Plus, ArrowUpRight } from "lucide-react";
import { createTag, toggleTag } from "@/app/actions";
import { initialResult, type Tag } from "@/lib/domain";
type NFCReader = {
  write: (
    message: { records: { recordType: string; data: string }[] },
    options?: { signal: AbortSignal },
  ) => Promise<void>;
};
export function NfcPanel({
  id,
  tags,
  demo,
  origin,
  onTagsChange: setTags,
}: {
  id: string;
  tags: Tag[];
  demo: boolean;
  origin: string;
  onTagsChange: Dispatch<SetStateAction<Tag[]>>;
}) {
  const list = tags;
  const [message, setMessage] = useState("");
  const [qr, setQr] = useState<{ image: string; label: string; url: string } | null>(null);
  const [writing, setWriting] = useState(false);
  const [result, action, pending] = useActionState(
    demo
      ? async (_: unknown, form: FormData) => {
          const label = String(form.get("label") || "").trim();
          if (!label || label.length > 60)
            return { ok: false, message: "Escribe un nombre de hasta 60 caracteres." };
          setTags((v) => [...v, { id: crypto.randomUUID(), label, active: true }]);
          return {
            ok: true,
            message: "Etiqueta de ejemplo creada. No está vinculada a un negocio real.",
          };
        }
      : createTag,
    initialResult,
  );
  const link = (tag: Tag) => tagEntryLink(origin, tag.id, demo);
  const localOnly = isLoopbackOrigin(origin);
  async function write(tag: Tag) {
    const Reader = (window as unknown as { NDEFReader?: new () => NFCReader }).NDEFReader;
    if (!Reader) {
      setMessage(
        "Este navegador no permite grabar NFC. En Android usa Chrome con NFC compatible. En iPhone, utiliza una app de escritura o solicita ayuda para la instalación.",
      );
      return;
    }
    if (demo) {
      setMessage(
        "La demo no graba chips físicos. Podrás hacerlo desde tu negocio cuando esté configurado.",
      );
      return;
    }
    setWriting(true);
    setMessage("Acerca una etiqueta compatible y escribible. Esperaremos hasta 30 segundos.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      await new Reader().write(
        { records: [{ recordType: "url", data: link(tag) }] },
        { signal: controller.signal },
      );
      setMessage(
        "Enlace grabado. Acerca otro móvil para comprobarlo antes de instalar la etiqueta.",
      );
    } catch {
      setMessage(
        "No se ha grabado. Comprueba el permiso NFC, el chip y su estado de escritura, y vuelve a intentarlo.",
      );
    } finally {
      clearTimeout(timeout);
      setWriting(false);
    }
  }
  return (
    <section className="panel">
      <div className="section-heading">
        <span className="eyebrow">UN GESTO PARA VOLVER</span>
        <h2>NFC y QR de tu local.</h2>
        <p>Un enlace estable para cada punto de tu negocio.</p>
      </div>
      {localOnly && (
        <div className="notice">
          El acceso actual solo abre en este ordenador. El QR para móvil necesita una dirección de
          prueba accesible desde el teléfono.
        </div>
      )}
      {demo && !localOnly && (
        <div className="notice">
          QR de prueba de conexión. Conecta el móvil a la misma Wi-Fi si el enlace usa una dirección
          de red local. Todavía no crea una tarjeta Wallet.
        </div>
      )}
      <form className="inline-form" action={action}>
        <input type="hidden" name="merchant_id" value={id} />
        <label>
          Nombre de la etiqueta
          <input name="label" required maxLength={60} placeholder="Por ejemplo, mostrador" />
        </label>
        <button disabled={pending}>
          <Plus size={17} />
          Crear etiqueta
        </button>
      </form>
      <p aria-live="polite" className="form-message">
        {result.message}
      </p>
      <div className="tag-list">
        {list.length ? (
          list.map((tag) => (
            <article className="tag-row" key={tag.id}>
              <span className="icon-tile">
                <Radio size={22} />
              </span>
              <div className="tag-info">
                <strong>{tag.label}</strong>
                <small>{tag.active ? "Activa" : "Desactivada"}</small>
                <span className="tag-url">{link(tag)}</span>
              </div>
              <div className="tag-actions">
                <button
                  className="secondary"
                  disabled={!tag.active || writing}
                  onClick={() => write(tag)}
                >
                  <Radio size={15} />
                  Grabar
                </button>
                <button
                  className="icon-button"
                  aria-label={`Copiar enlace de ${tag.label}`}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(link(tag));
                      setMessage("Enlace copiado.");
                    } catch {
                      setMessage(
                        "No se ha podido copiar. Puedes seleccionar el enlace de la etiqueta.",
                      );
                    }
                  }}
                >
                  <Copy size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Mostrar QR de ${tag.label}`}
                  onClick={async () => {
                    try {
                      if (localOnly) {
                        setMessage(
                          "Este enlace solo funciona en este ordenador. Para escanear desde el móvil hay que configurar una dirección accesible desde él.",
                        );
                        return;
                      }
                      setQr({
                        image: await QRCode.toDataURL(link(tag), { width: 280, margin: 2 }),
                        label: tag.label,
                        url: link(tag),
                      });
                    } catch {
                      setMessage("No se ha podido generar el QR.");
                    }
                  }}
                >
                  <QrCode size={17} />
                </button>
                <form
                  action={
                    demo
                      ? async () => {
                          setTags((v) =>
                            v.map((t) => (t.id === tag.id ? { ...t, active: !t.active } : t)),
                          );
                        }
                      : toggleTag
                  }
                >
                  <input type="hidden" name="merchant_id" value={id} />
                  <input type="hidden" name="tag_id" value={tag.id} />
                  <input type="hidden" name="active" value={String(!tag.active)} />
                  <button className="text-button" type="submit">
                    {tag.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">Crea tu primera etiqueta para preparar el mostrador.</p>
        )}
      </div>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
      {qr && qr.url && new URL(qr.url).origin === origin && !localOnly && (
        <div className="qr-preview">
          <img src={qr.image} width={240} height={240} alt={`Código QR de ${qr.label}`} />
          <div>
            <h3>{qr.label}</h3>
            <p>
              {demo
                ? "Abre la comprobación de conexión desde el móvil. Todavía no registra clientes ni crea una tarjeta Wallet."
                : "Comparte el mismo acceso que tu etiqueta NFC."}
            </p>
            <p className="qr-link-target">{qr.url}</p>
            <a className="button secondary" href={qr.image} download={`fideresto-qr.png`}>
              Descargar QR
              <ArrowUpRight size={15} />
            </a>
            <button className="text-button" onClick={() => setQr(null)}>
              Cerrar QR
            </button>
          </div>
        </div>
      )}
      <p className="muted">
        El chip abre el acceso al local. Los sellos siempre necesitan la confirmación del personal.
      </p>
    </section>
  );
}
