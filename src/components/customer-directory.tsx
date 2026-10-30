"use client";
import { useEffect, useRef, useState } from "react";
import { Search, UserRound, Phone, Pencil, Check, X } from "lucide-react";
import type { CustomerMatch, CustomerProfile, LoyaltyRole } from "@/lib/loyalty/types";
export function CustomerLookup({
  lab,
  merchant,
  persona,
  disabled,
  onSelect,
}: {
  lab: boolean;
  merchant?: string;
  persona: LoyaltyRole;
  disabled: boolean;
  onSelect: (code: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerMatch[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const request = useRef(0);
  useEffect(() => {
    const id = ++request.current;
    setResults([]);
    setError("");
    setSearched(false);
    setBusy(false);
    if (disabled || query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      try {
        const response = await fetch(lab ? "/api/laboratorio" : "/api/loyalty", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lab ? { persona, query } : { merchant, query }),
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "No se pudo realizar la búsqueda.");
        if (request.current === id) {
          setResults(result.results);
          setSearched(true);
        }
      } catch (e) {
        if (!controller.signal.aborted && request.current === id)
          setError(e instanceof Error ? e.message : "No se pudo buscar.");
      } finally {
        if (request.current === id) setBusy(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lab, merchant, persona, disabled]);
  return (
    <section className="panel customer-search">
      <label htmlFor="customer-search">Buscar cliente</label>
      <div className="customer-search-input">
        <Search size={19} />
        <input
          id="customer-search"
          type="search"
          autoComplete="off"
          maxLength={80}
          value={query}
          disabled={disabled}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre o número de teléfono"
          aria-describedby="customer-search-help"
        />
      </div>
      <p id="customer-search-help">
        Busca entre los clientes de este establecimiento.
        {lab ? " Prueba con Alex, Mar o sus teléfonos ficticios." : ""}
      </p>
      <div aria-live="polite">
        {busy && <p>Buscando…</p>}
        {error && <p className="notice error">{error}</p>}
        {!busy && searched && !results.length && (
          <p>No hay clientes que coincidan con la búsqueda.</p>
        )}
      </div>
      {results.length > 0 && (
        <ul className="customer-results" aria-label="Clientes encontrados">
          {results.map((c) => (
            <li key={c.card_code}>
              <button
                className="secondary"
                disabled={disabled}
                onClick={() => {
                  onSelect(c.card_code);
                  setQuery("");
                  setResults([]);
                }}
              >
                <span className="customer-result-avatar">
                  <UserRound size={19} />
                </span>
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.phone}</small>
                </span>
                <span>Seleccionar</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {results.length === 20 && (
        <p>Se muestran los primeros 20 resultados. Concreta la búsqueda.</p>
      )}
    </section>
  );
}
export function CustomerEditor({
  profile,
  disabled,
  onSave,
  onRefresh,
}: {
  profile: CustomerProfile;
  disabled: boolean;
  onSave: (p: CustomerProfile) => Promise<boolean>;
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  useEffect(() => {
    setDraft(profile);
    setEditing(false);
    setError("");
  }, [profile]);
  return (
    <section className="panel customer-profile">
      <div className="customer-profile-heading">
        <div>
          <span className="eyebrow">CLIENTE SELECCIONADO</span>
          <h2>{profile.name}</h2>
          <p>
            <Phone size={14} />
            {profile.phone}
            {profile.birthday_day && profile.birthday_month
              ? ` · Cumpleaños: ${profile.birthday_day}/${profile.birthday_month}`
              : ""}
          </p>
        </div>
        <div className="customer-profile-buttons">
          <button className="secondary" disabled={disabled} onClick={onRefresh}>
            Actualizar ficha
          </button>
          <button
            className="secondary"
            disabled={disabled}
            onClick={() => {
              setDraft(profile);
              setError("");
              setEditing(!editing);
            }}
          >
            <Pencil size={15} />
            {editing ? "Cerrar edición" : "Editar datos"}
          </button>
        </div>
      </div>
      {editing && (
        <form
          className="customer-profile-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            if ((draft.birthday_day === null) !== (draft.birthday_month === null)) {
              setError("Indica día y mes, o deja ambos vacíos.");
              return;
            }
            if (await onSave(draft)) setEditing(false);
          }}
        >
          <label>
            Nombre
            <input
              autoComplete="off"
              required
              maxLength={80}
              value={draft.name}
              disabled={disabled}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label>
            Teléfono
            <input
              type="tel"
              autoComplete="off"
              inputMode="tel"
              required
              maxLength={40}
              value={draft.phone}
              disabled={disabled}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
            <small>9 cifras para España o prefijo internacional con +.</small>
          </label>
          <label>
            Día de cumpleaños (opcional)
            <input
              type="number"
              min={1}
              max={31}
              value={draft.birthday_day ?? ""}
              disabled={disabled}
              onChange={(e) =>
                setDraft({ ...draft, birthday_day: e.target.value ? Number(e.target.value) : null })
              }
            />
          </label>
          <label>
            Mes de cumpleaños (opcional)
            <input
              type="number"
              min={1}
              max={12}
              value={draft.birthday_month ?? ""}
              disabled={disabled}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  birthday_month: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </label>
          <p>
            El teléfono no puede estar asignado a otro cliente de este local. Los datos de otros
            establecimientos son independientes.
          </p>
          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}
          <div className="customer-profile-buttons">
            <button disabled={disabled}>
              <Check size={16} />
              Guardar datos
            </button>
            <button
              type="button"
              className="secondary"
              disabled={disabled}
              onClick={() => setEditing(false)}
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
