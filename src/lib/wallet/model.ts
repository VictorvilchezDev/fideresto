import { z } from "zod";
export const walletSnapshotSchema = z.object({
  merchantId: z.uuid(),
  cardCode: z.uuid(),
  merchantName: z.string().min(2).max(100),
  stamps: z.number().int().min(0).max(10000),
  target: z.number().int().min(1).max(100),
  rewardText: z.string().min(1).max(240),
  availableRewards: z.number().int().min(0),
  sample: z.boolean().default(false),
});
export type WalletSnapshot = z.infer<typeof walletSnapshotSchema>;
export function walletIdentity(s: WalletSnapshot) {
  return `${s.sample ? "sample" : "card"}_${s.merchantId.replaceAll("-", "")}_${s.cardCode.replaceAll("-", "")}`;
}
export function walletBarcode(s: WalletSnapshot) {
  return `FDR1:${s.merchantId}:${s.cardCode}`;
}
export const sampleCard: WalletSnapshot = {
  merchantId: "00000000-0000-4000-8000-000000000001",
  cardCode: "00000000-0000-4000-8000-000000000003",
  merchantName: "Café Oliva · prueba",
  stamps: 5,
  target: 8,
  rewardText: "Un café por cuenta de la casa",
  availableRewards: 0,
  sample: true,
};
