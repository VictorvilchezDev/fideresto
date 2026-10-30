"use client";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { login } from "@/app/actions";
import { initialResult } from "@/lib/domain";
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, initialResult);
  return (
    <form action={action} className="form-stack">
      <label>
        Correo electrónico
        <input
          name="email"
          type="email"
          autoComplete="username"
          placeholder="tu@negocio.es"
          required
          maxLength={254}
        />
      </label>
      <label>
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          required
          maxLength={200}
        />
      </label>
      <p aria-live="polite" className="form-message">
        {state.message}
      </p>
      <button disabled={pending || !configured}>
        {pending ? "Entrando…" : "Entrar en mi espacio"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
