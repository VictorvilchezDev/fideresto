import { requireAdmin } from "@/lib/access";
import { Brand } from "@/components/brand";
import { AdminForm } from "@/components/admin-form";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const { client } = await requireAdmin();
  const { data, error } = await client.rpc("admin_list_merchants");
  if (error) throw new Error("No se han podido cargar los comercios.");
  return (
    <main className="admin-page">
      <header>
        <Brand />
        <Link className="button secondary" href="/app">
          Mis espacios
        </Link>
      </header>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRACIÓN FIDERESTO</span>
          <h1>El comienzo de cada local.</h1>
          <p>Alta asistida y accesos individuales desde el primer día.</p>
        </div>
      </div>
      <div className="lower-grid">
        <section className="panel">
          <h2>Comercios</h2>
          {(data as { id: string; name: string; active: boolean }[]).map((m) => (
            <div className="customer-row" key={m.id}>
              <span className="business-avatar">{m.name[0]}</span>
              <div>
                <strong>{m.name}</strong>
                <small>{m.active ? "Activo" : "Inactivo"}</small>
              </div>
            </div>
          ))}
          {!data?.length && (
            <p className="empty-state">
              Todavía no hay comercios. Crea el primero cuando la cuenta del dueño esté preparada.
            </p>
          )}
        </section>
        <section className="panel">
          <h2>Nuevo comercio</h2>
          <AdminForm />
        </section>
      </div>
      <p className="privacy-note">
        Este panel no concede acceso general a los clientes de cada negocio.
      </p>
    </main>
  );
}
