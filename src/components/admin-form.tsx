"use client";
import { useActionState } from "react";
import { createMerchant } from "@/app/actions";
import { initialResult } from "@/lib/domain";
export function AdminForm() {
  const [state, action, pending] = useActionState(createMerchant, initialResult);
  return (
    <form action={action} className="form-stack">
      <label>
        Nombre del negocio
        <input name="name" required minLength={2} maxLength={100} />
      </label>
      <label>
        Correo verificado del dueño
        <input name="owner_email" type="email" required maxLength={254} />
      </label>
      <p className="muted">
        Primero crea la cuenta del dueño en Supabase Auth. Esta operación asigna el comercio a esa
        cuenta.
      </p>
      <p role="status" className={state.ok ? "form-message success" : "form-message"}>
        {state.message}
      </p>
      <button disabled={pending}>{pending ? "Creando…" : "Crear comercio"}</button>
    </form>
  );
}
