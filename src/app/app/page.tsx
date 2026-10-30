import Link from "next/link";
import { requireUser } from "@/lib/access";
import { Brand } from "@/components/brand";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions";
export const dynamic = "force-dynamic";
export default async function AppPage() {
  const { client } = await requireUser();
  const [{ data: memberships, error }, { data: admin }] = await Promise.all([
    client.from("memberships").select("merchant_id,role,merchants(name)"),
    client.rpc("is_platform_admin"),
  ]);
  if (error) throw new Error("No se ha podido cargar el acceso al comercio.");
  if (memberships?.length === 1 && !admin) redirect(`/app/${memberships[0].merchant_id}`);
  return (
    <main className="center-page">
      <section className="panel access-picker">
        <Brand />
        <h1>Elige tu espacio</h1>
        {admin && (
          <Link className="button" href="/admin">
            Administración de Fideresto
          </Link>
        )}
        {memberships?.map((m) => (
          <Link className="button secondary" key={m.merchant_id} href={`/app/${m.merchant_id}`}>
            {(m.merchants as unknown as { name: string })?.name || "Mi comercio"}
          </Link>
        ))}
        {!memberships?.length && !admin && (
          <p>
            Tu cuenta está verificada, pero todavía no tiene un comercio asignado. Contacta con la
            administración de Fideresto.
          </p>
        )}
        <form action={logout}>
          <button className="text-button">Cerrar sesión</button>
        </form>
      </section>
    </main>
  );
}
