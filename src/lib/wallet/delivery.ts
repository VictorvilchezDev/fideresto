import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "../config";
import { walletSnapshotSchema } from "./model";
export function newDeliveryToken() {
  return randomBytes(32).toString("base64url");
}
export function deliveryHash(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("INVALID_DELIVERY_TOKEN");
  return createHash("sha256").update(token).digest("hex");
}
export async function walletDelivery(token: string) {
  let hash: string;
  try {
    hash = deliveryHash(token);
  } catch {
    return null;
  }
  const config = supabaseConfig();
  if (!config) return null;
  const client = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.rpc("wallet_delivery", { p_token_hash: hash });
  if (error || !data) return null;
  return walletSnapshotSchema.parse(data);
}
