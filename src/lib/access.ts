import "server-only";
import { redirect, notFound } from "next/navigation";
import { supabaseConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase/server";
import type { Role } from "@/lib/domain";

export async function requireUser() {
  if (!supabaseConfig()) redirect("/login?setup=1");
  const client = await supabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) redirect("/login");
  return { client, user: data.user };
}
export async function requireMerchant(id: string, ownerOnly = false) {
  const { client, user } = await requireUser();
  const { data, error } = await client
    .from("memberships")
    .select("role")
    .eq("merchant_id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error || !data || (ownerOnly && data.role !== "owner")) notFound();
  return { client, user, role: data.role as Role };
}
export async function requireAdmin() {
  const { client, user } = await requireUser();
  const { data, error } = await client.rpc("is_platform_admin");
  if (error || data !== true) notFound();
  return { client, user };
}
