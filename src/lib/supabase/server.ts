import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "@/lib/config";

export async function supabase() {
  const config = supabaseConfig();
  if (!config) throw new Error("SUPABASE_NOT_CONFIGURED");
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          /* Server Components cannot set cookies; proxy refreshes them. */
        }
      },
    },
  });
}
