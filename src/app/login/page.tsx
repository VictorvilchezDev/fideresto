import Link from "next/link";
import { Coffee, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { supabaseConfig } from "@/lib/config";
export default function LoginPage() {
  const configured = !!supabaseConfig();
  return (
    <main className="login-page">
      <section className="login-story">
        <Brand />
        <div className="story-copy">
          <span className="eyebrow">EL PRÓXIMO «LO DE SIEMPRE» EMPIEZA AQUÍ</span>
          <h1>
            Un buen café.
            <br />
            Una razón
            <br />
            <em>para volver.</em>
          </h1>
          <p>
            Cuida de quienes eligen tu local.
            <br />
            Nosotros te ayudamos a que repitan.
          </p>
          <div className="floating-card">
            <div className="card-heading">
              <Coffee size={24} />
              <span>
                Tu café de siempre<small>TARJETA DE FIDELIDAD</small>
              </span>
              <span className="chip-mini">8</span>
            </div>
            <div className="stamp-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <span className={i < 5 ? "stamp filled" : "stamp"} key={i}>
                  {i < 5 ? <Check size={20} /> : i + 1}
                </span>
              ))}
            </div>
            <p>Pequeños momentos. Grandes habituales.</p>
          </div>
        </div>
        <footer>Hecho para los lugares a los que siempre volvemos.</footer>
      </section>
      <section className="login-access">
        <div className="login-box">
          <span className="pill">
            <span className="status-dot" /> TU NEGOCIO, MÁS CERCA
          </span>
          <h2>Qué bueno verte.</h2>
          <p>Entra y sigue cuidando de tus habituales.</p>
          {!configured && (
            <div className="notice">
              La conexión con Supabase está pendiente. Mientras tanto, puedes explorar la primera
              demo.
            </div>
          )}
          <LoginForm configured={configured} />
          <div className="login-help">¿Necesitas acceso? Tu administrador te ayudará.</div>
          <div className="demo-link">
            <div>
              <strong>Conoce tu nuevo espacio</strong>
              <small>Demo interactiva · datos ficticios</small>
            </div>
            <Link href="/demo" aria-label="Explorar la demo">
              <ArrowUpRight size={23} />
            </Link>
          </div>
          <p className="privacy-note">
            <ShieldCheck size={15} /> Acceso individual para cada persona de tu equipo.
          </p>
        </div>
        <footer>Fideresto · Primera versión de trabajo</footer>
      </section>
    </main>
  );
}
