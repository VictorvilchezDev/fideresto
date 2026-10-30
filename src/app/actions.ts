"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireMerchant } from "@/lib/access";
import { programSchema, tagSchema, merchantSchema, type ActionResult } from "@/lib/domain";
import { supabaseConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase/server";

export async function login(_: ActionResult, form: FormData): Promise<ActionResult> {
  if (!supabaseConfig())
    return {
      ok: false,
      message: "El acceso real se habilitará al conectar Supabase. Puedes explorar la demo.",
    };
  const parsed = z
    .object({ email: z.email().max(254), password: z.string().min(1).max(200) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Revisa el correo y la contraseña." };
  const client = await supabase();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error)
    return {
      ok: false,
      message: "No hemos podido iniciar sesión. Revisa tus datos o contacta con tu administrador.",
    };
  redirect("/app");
}
export async function logout() {
  if (supabaseConfig()) {
    const client = await supabase();
    await client.auth.signOut();
  }
  redirect("/login");
}
export async function saveProgram(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = programSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { ok: false, message: "Revisa el premio, los sellos, el importe y los plazos." };
  const v = parsed.data;
  const { client } = await requireMerchant(v.merchant_id, true);
  const { data, error } = await client
    .from("programs")
    .update({
      stamp_target: v.stamp_target,
      reward_text: v.reward_text,
      minimum_spend_cents: Math.round(v.minimum_spend * 100),
      stamp_expiry_days: v.stamp_expiry_days,
      reward_expiry_days: v.reward_expiry_days,
    })
    .eq("merchant_id", v.merchant_id)
    .select("merchant_id");
  if (error || !data?.length)
    return { ok: false, message: "No se ha podido guardar. Inténtalo de nuevo." };
  revalidatePath(`/app/${v.merchant_id}`);
  return { ok: true, message: "Programa actualizado." };
}
export async function createTag(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = tagSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Escribe un nombre de hasta 60 caracteres." };
  const { client } = await requireMerchant(parsed.data.merchant_id, true);
  const { error } = await client.from("nfc_tags").insert(parsed.data);
  if (error) return { ok: false, message: "No se ha podido crear la etiqueta." };
  revalidatePath(`/app/${parsed.data.merchant_id}`);
  return { ok: true, message: "Etiqueta creada. Ya puedes grabar o compartir su enlace." };
}
export async function toggleTag(form: FormData) {
  const parsed = z
    .object({ merchant_id: z.uuid(), tag_id: z.uuid(), active: z.enum(["true", "false"]) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return;
  const { client } = await requireMerchant(parsed.data.merchant_id, true);
  const { error } = await client
    .from("nfc_tags")
    .update({ active: parsed.data.active === "true" })
    .eq("merchant_id", parsed.data.merchant_id)
    .eq("id", parsed.data.tag_id);
  if (error) throw new Error("No se ha podido cambiar el estado de la etiqueta.");
  revalidatePath(`/app/${parsed.data.merchant_id}`);
}
export async function createMerchant(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = merchantSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Revisa el nombre y el correo del dueño." };
  const { client } = await requireAdmin();
  const { error } = await client.rpc("admin_create_merchant", {
    business_name: parsed.data.name,
    owner_email: parsed.data.owner_email,
  });
  if (error)
    return {
      ok: false,
      message:
        "No se ha creado el negocio. El dueño debe tener primero una cuenta con correo verificado en Supabase Auth.",
    };
  revalidatePath("/admin");
  return { ok: true, message: "Negocio creado y asignado a su dueño." };
}
