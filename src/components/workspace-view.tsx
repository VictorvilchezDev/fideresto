"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Coffee,
  Gift,
  Gem,
  Home,
  Layers2,
  LogOut,
  Radio,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  MessageCircle,
} from "lucide-react";
import { LoyaltyWorkbench } from "@/components/loyalty-workbench";
import { Brand } from "@/components/brand";
import { ProgramForm } from "@/components/program-form";
import { NfcPanel } from "@/components/nfc-panel";
import { logout } from "@/app/actions";
import type { Workspace, Role } from "@/lib/domain";
type Tab = "home" | "program" | "nfc" | "team" | "connections";
const items = [
  { id: "home", label: "Mi local", icon: Home },
  { id: "program", label: "Programa", icon: Layers2 },
  { id: "nfc", label: "NFC y QR", icon: Radio },
  { id: "team", label: "Equipo", icon: Users },
  { id: "connections", label: "Conexiones", icon: Settings2 },
] as const;

export function WorkspaceView({
  workspace,
  demo = false,
  origin,
}: {
  workspace: Workspace;
  demo?: boolean;
  origin: string;
}) {
  const [tab, setTab] = useState<Tab>("home");
  const [role, setRole] = useState<Role>(workspace.role);
  const [tags, setTags] = useState(workspace.tags);
  const [program, setProgram] = useState(workspace.program);
  const [stamps, setStamps] = useState(5);
  const [reward, setReward] = useState(false);
  const [notice, setNotice] = useState("");
  const owner = role === "owner";
  const nav = owner ? items : items.filter((i) => i.id === "home");
  function giveStamp() {
    const next = stamps + 1;
    if (next >= program.stamp_target) {
      setStamps(0);
      setReward(true);
      setNotice("Sello de ejemplo confirmado. Premio disponible para este cliente ficticio.");
    } else {
      setStamps(next);
      setNotice("Sello de ejemplo confirmado. No se han modificado datos reales.");
    }
  }
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="brand-link" href={demo ? "/demo" : "/app"}>
          <Brand />
        </Link>
        <div className="business-switch">
          <span className="business-avatar">{workspace.name.slice(0, 1)}</span>
          <div>
            <strong>{workspace.name}</strong>
            <small>{owner ? "Espacio del propietario" : "Espacio del equipo"}</small>
          </div>
        </div>
        <span className="nav-label">TU ESPACIO</span>
        <nav aria-label="Navegación principal">
          {nav.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "nav-item selected" : "nav-item"}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
            >
              <item.icon size={19} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={20} />
            <strong>Lo pequeño cuenta.</strong>
            <p>Una buena bienvenida también es fidelizar.</p>
          </div>
          {demo ? (
            <Link className="nav-item" href="/login">
              <ArrowDownLeft size={18} />
              Volver al acceso
            </Link>
          ) : (
            <form action={logout}>
              <button className="nav-item">
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </form>
          )}
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumb">
            Tu espacio <span>/</span> {items.find((i) => i.id === tab)?.label}
          </div>
          <div className="topbar-right">
            <span className="pill">
              <span className="status-dot" />
              {demo ? "DEMO" : "PRIMERA VERSIÓN"}
            </span>
            <span className="user-avatar">{owner ? "PR" : "EQ"}</span>
          </div>
        </header>
        {demo && (
          <div className="demo-banner">
            <span>
              <strong>Vista previa interactiva</strong> · Datos ficticios. Los cambios se pierden al
              recargar.
            </span>
            <Link className="secondary button" href="/laboratorio">
              Probar con historial
            </Link>
            <label>
              Ver como
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as Role);
                  setTab("home");
                }}
              >
                <option value="owner">Dueño</option>
                <option value="staff">Camarero</option>
              </select>
            </label>
          </div>
        )}
        <main className="workspace-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {owner ? "TU LOCAL. SUS BUENAS COSTUMBRES." : "CADA VISITA CUENTA."}
              </span>
              <h1>
                {tab === "home" ? "Haz que vuelvan." : items.find((i) => i.id === tab)?.label}
              </h1>
              <p>
                {tab === "home"
                  ? "Un espacio para cuidar de quienes siempre vuelven."
                  : "Todo a punto, a la manera de tu local."}
              </p>
            </div>
            {owner && tab === "home" && (
              <button className="secondary" onClick={() => setTab("program")}>
                <Settings2 size={16} />
                Configurar programa
              </button>
            )}
          </div>
          {tab === "home" && (
            <>
              <div className="dashboard-grid">
                <section className="hero-panel">
                  <span className="pill light">EL SIGUIENTE CAFÉ PUEDE SER EL TUYO</span>
                  <h2>
                    De una visita
                    <br />a <em>«lo de siempre».</em>
                  </h2>
                  <p>Un gesto sencillo para agradecer cada vuelta.</p>
                  <div className="hero-actions">
                    {owner ? (
                      <button onClick={() => setTab("program")}>
                        Mi programa
                        <ArrowRight size={17} />
                      </button>
                    ) : (
                      <span className="pill light">SELLOS Y CANJES</span>
                    )}
                    <span>Un sello por cuenta</span>
                  </div>
                  <div className="hero-decoration">
                    <Coffee size={70} strokeWidth={1} />
                  </div>
                </section>
                <section className="loyalty-card">
                  <div className="card-heading">
                    <span className="icon-tile">
                      <Coffee size={23} />
                    </span>
                    <div>
                      <strong>{workspace.name}</strong>
                      <small>TU TARJETA DE FIDELIDAD</small>
                    </div>
                    <span className="card-logo">
                      <Gem size={24} />
                    </span>
                  </div>
                  <div className="stamp-grid">
                    {Array.from({ length: Math.min(program.stamp_target, 12) }, (_, i) => (
                      <span key={i} className={demo && i < stamps ? "stamp filled" : "stamp"}>
                        {demo && i < stamps ? <Check size={20} /> : i + 1}
                      </span>
                    ))}
                  </div>
                  {program.stamp_target > 12 && (
                    <small>{program.stamp_target} sellos en total</small>
                  )}
                  <div className="card-reward">
                    <Gift size={18} />
                    <div>
                      <small>TU PRÓXIMO PREMIO</small>
                      <strong>{program.reward_text}</strong>
                    </div>
                  </div>
                  <div className="card-bottom">
                    <span>
                      {demo ? "Vista previa con progreso ficticio" : "Vista previa del programa"}
                    </span>
                    <span>{program.stamp_target} sellos</span>
                  </div>
                </section>
              </div>
              <div className="lower-grid">
                <section className="panel">
                  <div className="panel-title">
                    <div>
                      <span className="eyebrow">EN EL MOSTRADOR</span>
                      <h2>{demo ? "Una visita de ejemplo" : "Prepara la primera visita"}</h2>
                    </div>
                    <span className="icon-tile">
                      <Users size={20} />
                    </span>
                  </div>
                  {demo ? (
                    <>
                      <div className="customer-row">
                        <span className="customer-avatar">AL</span>
                        <div>
                          <strong>Alex · cliente ficticio</strong>
                          <small>
                            {stamps} de {program.stamp_target} sellos · demo
                          </small>
                        </div>
                        <button onClick={giveStamp}>
                          Confirmar sello
                          <Check size={16} />
                        </button>
                      </div>
                      {reward && (
                        <div className="reward-row">
                          <Gift size={20} />
                          <span>{program.reward_text}</span>
                          <button
                            className="secondary"
                            onClick={() => {
                              setReward(false);
                              setNotice(
                                "Premio ficticio canjeado. No se ha realizado un canje real.",
                              );
                            }}
                          >
                            Canjear
                          </button>
                        </div>
                      )}
                      <p className="muted">
                        Prueba el recorrido. El importe y el pago se comprueban en el local.
                      </p>
                    </>
                  ) : (
                    <LoyaltyWorkbench merchant={workspace.id} embedded />
                  )}
                  {notice && (
                    <p role="status" className="notice">
                      {notice}
                    </p>
                  )}
                </section>
                <section className="panel checklist">
                  <span className="eyebrow">A PUNTO PARA EMPEZAR</span>
                  <h2>Tu puesta en marcha</h2>
                  <div>
                    <span className="check-circle">
                      <Check size={15} />
                    </span>
                    <p>
                      Define lo que quieres regalar
                      <small>Un premio escrito con tus palabras.</small>
                    </p>
                  </div>
                  <div>
                    <span className={tags.length ? "check-circle" : "step-circle"}>
                      {tags.length ? <Check size={15} /> : "2"}
                    </span>
                    <p>
                      Prepara el NFC y el QR<small>La puerta de entrada a tu programa.</small>
                    </p>
                  </div>
                  <div>
                    <span className="step-circle">3</span>
                    <p>
                      Conecta Wallet y WhatsApp<small>Integraciones todavía pendientes.</small>
                    </p>
                  </div>
                  {owner && (
                    <button className="text-button" onClick={() => setTab("nfc")}>
                      Preparar mis etiquetas
                      <ArrowUpRight size={15} />
                    </button>
                  )}
                </section>
              </div>
            </>
          )}
          {tab === "program" && owner && (
            <div className="program-layout">
              <section className="panel">
                <ProgramForm id={workspace.id} program={program} demo={demo} onSaved={setProgram} />
              </section>
              <aside className="info-panel">
                <Gift size={27} />
                <h2>Tan sencillo como decir gracias.</h2>
                <p>
                  Escribe el premio que tiene sentido para tu local. Un café, una tostada o lo que
                  tú quieras.
                </p>
                <div className="divider" />
                <p>
                  El consumo mínimo puede ser 0. Y tú eliges si los sellos y los premios caducan.
                </p>
                <small>La imagen personalizada de la tarjeta se incorporará en otra entrega.</small>
              </aside>
            </div>
          )}
          {tab === "nfc" && owner && (
            <NfcPanel
              id={workspace.id}
              tags={tags}
              demo={demo}
              origin={origin}
              onTagsChange={setTags}
            />
          )}
          {tab === "team" && owner && (
            <section className="panel">
              <span className="eyebrow">CADA PERSONA, SU ACCESO</span>
              <h2>El equipo de tu local</h2>
              <p>
                El dueño configura y autoriza. El camarero confirma sellos, canjea premios y
                solicita correcciones.
              </p>
              <div className="team-list">
                {workspace.team.map((person, i) => (
                  <div className="customer-row" key={person.user_id}>
                    <span className="customer-avatar">{person.role === "owner" ? "PR" : "EQ"}</span>
                    <div>
                      <strong>
                        {person.role === "owner" ? "Propietario" : `Miembro del equipo ${i + 1}`}
                      </strong>
                      <small>
                        {demo ? "Persona ficticia" : `Identificador ${person.user_id.slice(0, 8)}`}
                      </small>
                    </div>
                    <span className="pill">{person.role === "owner" ? "DUEÑO" : "CAMARERO"}</span>
                  </div>
                ))}
              </div>
              <div className="notice">
                Las invitaciones y la revocación del equipo desde este panel están pendientes.
                Durante esta primera etapa se provisionan de forma controlada.
              </div>
            </section>
          )}
          {tab === "connections" && owner && (
            <section className="panel">
              <span className="eyebrow">EL PROGRAMA EN SU BOLSILLO</span>
              <h2>Wallet y WhatsApp</h2>
              <p>Las conexiones reales forman parte del piloto y todavía no están activadas.</p>
              <div className="connection-grid">
                {["Apple Wallet", "Google Wallet", "WhatsApp del negocio"].map((label) => (
                  <article key={label}>
                    <span className="icon-tile">
                      {label.includes("WhatsApp") ? (
                        <MessageCircle size={23} />
                      ) : (
                        <Layers2 size={23} />
                      )}
                    </span>
                    <h3>{label}</h3>
                    <span className="pill">PENDIENTE</span>
                    <p>
                      {label.includes("WhatsApp")
                        ? "Los mensajes saldrán desde el número del local."
                        : "Tarjeta con sellos y premios del comercio."}
                    </p>
                  </article>
                ))}
              </div>
              <p className="privacy-note">
                <ShieldCheck size={17} />
                Las claves se gestionarán en el servidor.
              </p>
            </section>
          )}
          <footer className="content-footer">
            <span>
              fideresto. <span className="muted">· Hecho para volver.</span>
            </span>
            <span>Primera versión de trabajo</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navegación móvil">
        {nav.map((item) => (
          <button
            aria-label={item.label}
            aria-current={tab === item.id ? "page" : undefined}
            className={tab === item.id ? "active" : ""}
            key={item.id}
            onClick={() => setTab(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
