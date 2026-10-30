import Link from "next/link";
export default function NotFound() {
  return (
    <main className="center-page">
      <div className="panel">
        <span className="eyebrow">Fideresto</span>
        <h1>Este espacio no está disponible</h1>
        <p>Comprueba el enlace o entra con tu cuenta.</p>
        <Link className="button" href="/login">
          Ir al acceso
        </Link>
      </div>
    </main>
  );
}
