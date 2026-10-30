"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Coffee, Gift, History, ShieldCheck, Sparkles } from "lucide-react";
import { CustomerLookup, CustomerEditor } from "./customer-directory";
import { WalletDeliveryPanel } from "@/components/wallet/delivery-panel";
import { Brand } from "./brand";
import type {
  Card,
  CustomerProfile,
  LoyaltyAction,
  LoyaltyResponse,
  LoyaltyRole,
} from "@/lib/loyalty/types";
const labels: Record<LoyaltyAction, string> = {
  stamp: "Sello confirmado",
  redeem: "Premio canjeado",
  request: "Corrección solicitada",
  approve: "Corrección autorizada",
  reject: "Corrección rechazada",
};
const statusLabels = {
  available: "Disponible",
  redeemed: "Canjeado",
  expired: "Caducado",
  voided: "Anulado por corrección",
};
function date(value: string) {
  return new Date(value).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function LoyaltyWorkbench({
  lab = false,
  merchant,
  initial,
  embedded = false,
}: {
  lab?: boolean;
  merchant?: string;
  initial?: LoyaltyResponse;
  embedded?: boolean;
}) {
  const [data, setData] = useState(initial);
  const [persona, setPersona] = useState<LoyaltyRole>("staff");
  const [cardCode, setCardCode] = useState(initial?.card.card_code ?? "");
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [correcting, setCorrecting] = useState("");
  const [reason, setReason] = useState("");
  const [retry, setRetry] = useState<{
    action: LoyaltyAction;
    payload: Record<string, unknown>;
    key: string;
    card: string;
    persona: LoyaltyRole;
  } | null>(null);
  const lock = useRef(false);
  const generation = useRef(0);
  const role = data?.role ?? persona;

  const card = data?.card;
  async function load(
    selected = cardCode,
    actor = persona,
    command?: { action: LoyaltyAction; payload: Record<string, unknown>; key: string },
    program?: Card["program"],
    profile?: CustomerProfile,
  ) {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    const current = ++generation.current;
    try {
      const response = await fetch(lab ? "/api/laboratorio" : "/api/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          lab
            ? { persona: actor, card: selected, command, program, profile }
            : { merchant, card: selected, command, profile },
        ),
      });
      const result = await response.json().catch(() => {
        throw new Error("No se ha podido conectar con la tarjeta. Actualiza e inténtalo de nuevo.");
      });
      if (!response.ok) throw new Error(result.error ?? "No se ha podido cargar la tarjeta.");
      if (current === generation.current) {
        setData(result);
        setCardCode(result.card.card_code);
        if (command) {
          setPaid(false);
          setCorrecting("");
          setReason("");
          setRetry(null);
          setNotice("Operación guardada en el historial.");
        } else if (profile) setNotice("Datos del cliente guardados.");
        else if (program) setNotice("Programa de pruebas guardado.");
      }
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo conectar. Recarga la tarjeta antes de continuar.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function act(action: LoyaltyAction, payload: Record<string, unknown>) {
    if (lock.current || retry) return;
    const request = { action, payload, key: crypto.randomUUID(), card: cardCode, persona };
    setRetry(request);
    void load(cardCode, persona, request);
  }
  function switchPersona(value: LoyaltyRole) {
    if (lock.current || retry) return;
    setPersona(value);
    setData(undefined);
    setPaid(false);
    setNotice("");
    setCorrecting("");
    if (cardCode) void load(cardCode, value);
  }
  const body = (
    <>
      {lab && (
        <div className="demo-banner lab-banner">
          <span>
            <strong>Laboratorio local</strong> · Personas ficticias. Historial guardado en este
            equipo.
          </span>
          <label>
            Probar como
            <select
              aria-label="Probar como"
              value={persona}
              disabled={busy || !!retry}
              onChange={(e) => switchPersona(e.target.value as LoyaltyRole)}
            >
              <option value="staff">Camarero</option>
              <option value="owner">Dueño</option>
            </select>
          </label>
        </div>
      )}
      {!embedded && (
        <div className="page-heading">
          <div>
            <span className="eyebrow">CADA VISITA DEJA HUELLA</span>
            <h1>Una visita más cerca.</h1>
            <p>Busca a tu cliente, confirma su cuenta y suma una nueva visita.</p>
          </div>
          <span className="pill">
            <ShieldCheck size={15} />
            {lab ? "ENTORNO DE PRUEBAS" : "FIDELIZACIÓN"}
          </span>
        </div>
      )}
      <CustomerLookup
        lab={lab}
        merchant={merchant}
        persona={persona}
        disabled={busy || !!retry}
        onSelect={(code) => {
          setCardCode(code);
          setData(undefined);
          setPaid(false);
          setNotice("");
          setCorrecting("");
          void load(code);
        }}
      />
      <div aria-live="polite">
        {notice && <p className="notice">{notice}</p>}
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
      </div>
      {retry && error && (
        <div className="panel loyalty-retry">
          <p>
            La solicitud mantiene su identificador para que un reintento no duplique el movimiento.
          </p>
          <button disabled={busy} onClick={() => void load(retry.card, retry.persona, retry)}>
            Reintentar la misma operación
          </button>
          <button
            className="secondary"
            disabled={busy}
            onClick={() => {
              setRetry(null);
              setNotice("");
              void load();
            }}
          >
            Consultar estado y descartar reintento
          </button>
        </div>
      )}
      {card ? (
        <>
          <CustomerEditor
            key={card.card_code}
            profile={card.profile}
            disabled={busy || !!retry}
            onRefresh={() => void load()}
            onSave={(p) => load(cardCode, persona, undefined, undefined, p)}
          />
          <WalletDeliveryPanel
            key={card.card_code}
            merchant={merchant}
            card={card.card_code}
            verified={card.profile.phone_verified}
            lab={lab}
          />
          <div className="loyalty-grid">
            <section className="panel loyalty-card">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">
                    {lab ? "CAFÉ OLIVA · DATOS FICTICIOS" : "PROGRESO DEL CLIENTE"}
                  </span>
                  <h2>{card.name}</h2>
                </div>
                <span className="icon-tile">
                  <Coffee size={24} />
                </span>
              </div>
              <p className="loyalty-progress">
                <strong>{card.stamps}</strong>
                <span> / {card.program.stamp_target} sellos</span>
              </p>
              <div
                className="loyalty-stamps"
                aria-label={`${card.stamps} de ${card.program.stamp_target} sellos`}
              >
                {Array.from({ length: Math.min(card.program.stamp_target, 20) }, (_, i) => (
                  <span className={i < card.stamps ? "stamp filled" : "stamp"} key={i}>
                    {i < card.stamps ? <Check size={20} /> : i + 1}
                  </span>
                ))}
              </div>
              {card.program.stamp_target > 20 && (
                <p>{card.program.stamp_target} sellos para completar la tarjeta.</p>
              )}
              <span className="eyebrow">PRÓXIMO PREMIO</span>
              <h3>{card.program.reward_text}</h3>
              <p className="muted">
                {card.stamp_expires_at
                  ? `Sellos válidos hasta ${date(card.stamp_expires_at)}.`
                  : "Sin sellos pendientes de caducar."}{" "}
                {card.program.stamp_expiry_days
                  ? `Se renuevan con actividad válida cada ${card.program.stamp_expiry_days} días.`
                  : "Caducidad de sellos desactivada."}
              </p>
              {
                <div className="loyalty-confirm">
                  <label className="loyalty-checkbox">
                    <input
                      type="checkbox"
                      checked={paid}
                      disabled={busy || !!retry}
                      onChange={(e) => setPaid(e.target.checked)}
                    />
                    <span>
                      La cuenta está pagada
                      {card.program.minimum_spend_cents > 0
                        ? ` y alcanza el mínimo de ${(card.program.minimum_spend_cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`
                        : ""}
                      .
                    </span>
                  </label>
                  <button
                    disabled={!paid || busy || !!retry}
                    onClick={() => act("stamp", { paid: true })}
                  >
                    <Check size={17} />
                    Confirmar un sello
                  </button>
                  <small>Un sello por cuenta. El empleado comprueba el pago.</small>
                </div>
              }
            </section>
            <section className="panel loyalty-prizes">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">GANADOS CON CADA VISITA</span>
                  <h2>Premios del cliente</h2>
                </div>
                <span className="icon-tile">
                  <Gift size={23} />
                </span>
              </div>
              {!card.rewards.length ? (
                <div className="empty-state">
                  <Sparkles size={30} />
                  <h3>El primero está cerca</h3>
                  <p>
                    Al completar los sellos aparecerá aquí. El cliente puede seguir acumulando
                    aunque tenga premios pendientes.
                  </p>
                </div>
              ) : (
                card.rewards.map((r) => (
                  <article className="loyalty-prize" key={r.id}>
                    <span className={`pill reward-${r.status}`}>{statusLabels[r.status]}</span>
                    <h3>{r.reward_text}</h3>
                    <p>{r.expires_at ? `Caduca el ${date(r.expires_at)}` : "Sin caducidad"}</p>
                    {r.status === "available" && (
                      <button
                        className="secondary"
                        disabled={busy || !!retry}
                        onClick={() => act("redeem", { reward_id: r.id })}
                      >
                        <Gift size={16} />
                        Canjear premio
                      </button>
                    )}
                  </article>
                ))
              )}
            </section>
          </div>
          {role === "owner" && (
            <section className="panel loyalty-requests">
              <span className="eyebrow">CONTROL DEL PROPIETARIO</span>
              <h2>Correcciones pendientes de {card.name}</h2>
              {!card.pending_requests.length ? (
                <p>No hay solicitudes pendientes para esta tarjeta.</p>
              ) : (
                card.pending_requests.map((h) => (
                  <div className="loyalty-request" key={h.id}>
                    <div>
                      <strong>{h.reason}</strong>
                      <p>
                        Solicitud del {date(h.created_at)} · {h.target_id.slice(0, 8)}
                      </p>
                    </div>
                    <div>
                      <button
                        disabled={busy || !!retry}
                        onClick={() => act("approve", { request_id: h.id })}
                      >
                        Autorizar
                      </button>
                      <button
                        className="secondary"
                        disabled={busy || !!retry}
                        onClick={() => act("reject", { request_id: h.id })}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}
          <section className="panel loyalty-history">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">TODO QUEDA REGISTRADO</span>
                <h2>Historial de {card.name}</h2>
              </div>
              <History size={21} />
            </div>
            <p>Últimos 60 movimientos. Una corrección conserva la operación original.</p>
            {!card.history.length && <p>Aún no hay movimientos.</p>}
            {card.history.map((h) => (
              <div className="loyalty-movement" key={h.id}>
                <div className="movement-line">
                  <span className="movement-dot" />
                  <div>
                    <strong>{labels[h.action]}</strong>
                    <small>
                      {date(h.created_at)} · {h.id.slice(0, 8)}
                      {h.reversed ? " · Corregido" : ""}
                      {h.correction_pending ? " · Corrección pendiente" : ""}
                      {h.resolution
                        ? ` · ${h.resolution === "pending" ? "Pendiente" : h.resolution === "approve" ? "Autorizada" : "Rechazada"}`
                        : ""}
                    </small>
                    {h.reason && <p>{h.reason}</p>}
                  </div>
                  {["stamp", "redeem"].includes(h.action) &&
                    !h.reversed &&
                    !h.correction_pending && (
                      <button
                        className="secondary"
                        disabled={busy || !!retry}
                        onClick={() => {
                          setCorrecting(correcting === h.id ? "" : h.id);
                          setReason("");
                        }}
                      >
                        Solicitar corrección
                      </button>
                    )}
                </div>
                {correcting === h.id && (
                  <form
                    className="loyalty-correction"
                    onSubmit={(e) => {
                      e.preventDefault();
                      act("request", { operation_id: h.id, reason });
                    }}
                  >
                    <label>
                      Motivo de la corrección
                      <textarea
                        minLength={4}
                        maxLength={500}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder="Explica qué ha ocurrido"
                      />
                    </label>
                    <button disabled={busy || !!retry || reason.trim().length < 4}>
                      Enviar al dueño
                    </button>
                  </form>
                )}
              </div>
            ))}
          </section>
          {lab && role === "owner" && (
            <details className="panel loyalty-settings">
              <summary>Configurar el programa de pruebas</summary>
              <p>
                Solo modifica este laboratorio. Los premios ya ganados conservan su texto y
                caducidad.
              </p>
              <form
                key={JSON.stringify(card.program)}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const days = (key: string) => (f.get(key) === "" ? null : Number(f.get(key)));
                  void load(cardCode, persona, undefined, {
                    stamp_target: Number(f.get("target")),
                    reward_text: String(f.get("reward")),
                    minimum_spend_cents: Math.round(Number(f.get("minimum")) * 100),
                    stamp_expiry_days: days("stamp_days"),
                    reward_expiry_days: days("reward_days"),
                  });
                }}
              >
                <label>
                  Sellos por premio
                  <input
                    name="target"
                    type="number"
                    min={1}
                    max={100}
                    defaultValue={card.program.stamp_target}
                    required
                  />
                </label>
                <label>
                  Premio
                  <input
                    name="reward"
                    maxLength={240}
                    defaultValue={card.program.reward_text}
                    required
                  />
                </label>
                <label>
                  Importe mínimo (€)
                  <input
                    name="minimum"
                    type="number"
                    min={0}
                    max={100000}
                    step="0.01"
                    defaultValue={card.program.minimum_spend_cents / 100}
                    required
                  />
                </label>
                <label>
                  Caducidad de sellos (días sin actividad)
                  <input
                    name="stamp_days"
                    type="number"
                    min={1}
                    max={3650}
                    defaultValue={card.program.stamp_expiry_days ?? ""}
                    placeholder="Vacío = sin caducidad"
                  />
                </label>
                <label>
                  Caducidad de premios (días desde obtención)
                  <input
                    name="reward_days"
                    type="number"
                    min={1}
                    max={3650}
                    defaultValue={card.program.reward_expiry_days ?? ""}
                    placeholder="Vacío = sin caducidad"
                  />
                </label>
                <button disabled={busy || !!retry}>Guardar programa de pruebas</button>
              </form>
            </details>
          )}
        </>
      ) : (
        !busy && (
          <div className="panel empty-state">
            <Coffee size={30} />
            <h2>Empezamos por su tarjeta</h2>
            <p>
              {lab
                ? "Busca y selecciona un cliente ficticio para probar el flujo."
                : "Introduce el código que presenta el cliente para consultar sus sellos y premios."}
            </p>
          </div>
        )
      )}
      {lab && (
        <p className="loyalty-lab-note">
          Este laboratorio usa PostgreSQL local con las migraciones del proyecto. No envía WhatsApp,
          no genera pases Wallet y no verifica teléfonos reales. La demo visual mantiene su
          configuración independiente.
        </p>
      )}
    </>
  );
  return embedded ? (
    <div className="loyalty-embedded">{body}</div>
  ) : (
    <div className="loyalty-page">
      <header className="loyalty-header">
        <Link href={lab ? "/demo" : "/app"}>
          <Brand />
        </Link>
        <Link className="secondary button" href={lab ? "/demo" : "/app"}>
          <ArrowLeft size={16} />
          {lab ? "Volver a la demo" : "Mi espacio"}
        </Link>
      </header>
      <main>{body}</main>
    </div>
  );
}
