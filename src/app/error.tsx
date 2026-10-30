"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="center-page">
      <div className="panel">
        <h1>No hemos podido cargar esta página</h1>
        <p>Vuelve a intentarlo. Si continúa, contacta con tu administrador.</p>
        <button onClick={reset}>Reintentar</button>
      </div>
    </main>
  );
}
