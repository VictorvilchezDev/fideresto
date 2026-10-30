import { z } from "zod";

export const programSchema = z.object({
  merchant_id: z.uuid(),
  stamp_target: z.coerce.number().int().min(1).max(100),
  reward_text: z.string().trim().min(1).max(240),
  minimum_spend: z.coerce
    .number()
    .min(0)
    .max(100000)
    .refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.000001),
  stamp_expiry_days: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(3650)])
    .transform((v) => (v === "" ? null : v)),
  reward_expiry_days: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(3650)])
    .transform((v) => (v === "" ? null : v)),
});
export const tagSchema = z.object({
  merchant_id: z.uuid(),
  label: z.string().trim().min(1).max(60),
});
export const merchantSchema = z.object({
  name: z.string().trim().min(2).max(100),
  owner_email: z.email().max(254),
});
export type Role = "owner" | "staff";
export type Program = {
  stamp_target: number;
  reward_text: string;
  minimum_spend_cents: number;
  stamp_expiry_days: number | null;
  reward_expiry_days: number | null;
};
export type Tag = { id: string; label: string; active: boolean };
export type Workspace = {
  id: string;
  name: string;
  role: Role;
  program: Program;
  tags: Tag[];
  team: { user_id: string; role: Role }[];
};
export type ActionResult = { ok: boolean; message: string };
export const initialResult: ActionResult = { ok: false, message: "" };
