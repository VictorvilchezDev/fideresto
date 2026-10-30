"use client";
import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveProgram } from "@/app/actions";
import { initialResult, programSchema, type Program } from "@/lib/domain";
export function ProgramForm({
  id,
  program,
  demo,
  onSaved,
}: {
  id: string;
  program: Program;
  demo: boolean;
  onSaved: (p: Program) => void;
}) {
  const [result, action, pending] = useActionState(
    demo
      ? async (_: unknown, form: FormData) => {
          const v = programSchema.safeParse(Object.fromEntries(form));
          if (!v.success) return { ok: false, message: "Revisa los campos del programa." };
          onSaved({
            stamp_target: v.data.stamp_target,
            reward_text: v.data.reward_text,
            minimum_spend_cents: Math.round(v.data.minimum_spend * 100),
            stamp_expiry_days: v.data.stamp_expiry_days,
            reward_expiry_days: v.data.reward_expiry_days,
          });
          return {
            ok: true,
            message: "Vista previa actualizada. Los cambios de la demo se pierden al recargar.",
          };
        }
      : saveProgram,
    initialResult,
  );
  return (
    <form action={action} className="form-stack program-form">
      <input type="hidden" name="merchant_id" value={id} />
      <div className="section-heading">
        <span className="eyebrow">A TU MANERA</span>
        <h2>Tu programa, tus reglas.</h2>
        <p>Elige cómo agradecerles que vuelvan.</p>
      </div>
      <div className="two-fields">
        <label>
          Sellos para conseguir el premio
          <input
            name="stamp_target"
            type="number"
            min={1}
            max={100}
            required
            defaultValue={program.stamp_target}
          />
        </label>
        <label>
          Consumo mínimo por cuenta (€)
          <input
            name="minimum_spend"
            type="number"
            min={0}
            max={100000}
            step="0.01"
            required
            defaultValue={program.minimum_spend_cents / 100}
          />
          <small>0 € significa que no hay importe mínimo.</small>
        </label>
      </div>
      <label>
        ¿Cuál es el premio?
        <textarea
          name="reward_text"
          rows={3}
          maxLength={240}
          required
          defaultValue={program.reward_text}
          placeholder="Escribe lo que quieres ofrecer"
        />
        <small>Escríbelo con tus palabras. Así lo verá tu cliente.</small>
      </label>
      <div className="divider" />
      <h3>El tiempo también lo decides tú</h3>
      <div className="two-fields">
        <label>
          Sellos: días sin actividad
          <input
            type="number"
            name="stamp_expiry_days"
            min={1}
            max={3650}
            defaultValue={program.stamp_expiry_days ?? ""}
            placeholder="Sin caducidad"
          />
        </label>
        <label>
          Premio: días desde que se obtiene
          <input
            type="number"
            name="reward_expiry_days"
            min={1}
            max={3650}
            defaultValue={program.reward_expiry_days ?? ""}
            placeholder="Sin caducidad"
          />
        </label>
      </div>
      <p className="muted">Deja cada plazo vacío para desactivar su caducidad.</p>
      <p className={result.ok ? "form-message success" : "form-message"} aria-live="polite">
        {result.message}
      </p>
      <button disabled={pending}>
        <Save size={17} />
        {pending ? "Guardando…" : demo ? "Actualizar vista previa" : "Guardar programa"}
      </button>
    </form>
  );
}
