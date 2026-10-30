import { z } from "zod";
export const commandSchema = z.object({
  merchant: z.uuid(),
  card: z.uuid(),
  action: z.enum(["stamp", "redeem", "request", "approve", "reject"]),
  key: z.uuid(),
  payload: z.record(z.string(), z.unknown()).refine((v) => JSON.stringify(v).length <= 2048),
});
export const labRequestSchema = z
  .object({
    persona: z.enum(["owner", "staff", "consumer"]),
    card: z.uuid().optional(),
    command: commandSchema.omit({ merchant: true, card: true }).optional(),
    program: z
      .object({
        stamp_target: z.number().int().min(1).max(100),
        reward_text: z.string().trim().min(1).max(240),
        minimum_spend_cents: z.number().int().min(0).max(10000000),
        stamp_expiry_days: z.number().int().min(1).max(3650).nullable(),
        reward_expiry_days: z.number().int().min(1).max(3650).nullable(),
      })
      .optional(),
  })
  .refine((v) => !(v.command && v.program));
export function localLabEnabled() {
  return process.env.NODE_ENV === "development" && process.env.FIDERESTO_LOCAL_LAB === "1";
}
export function localLabRequestAllowed(req: Request) {
  if (!localLabEnabled()) return false;
  const url = new URL(req.url);
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return false;
  const incoming = new URL(`${url.protocol}//${req.headers.get("host") ?? url.host}`);
  if (!["127.0.0.1", "localhost", "[::1]"].includes(incoming.hostname)) return false;
  return req.method === "GET" || req.headers.get("origin") === incoming.origin;
}
// Bound bytes while reading; a false/missing Content-Length does not bypass the cap.
export async function readSmallJson(req: Request, limit = 8192): Promise<unknown> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("INVALID_BODY");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
