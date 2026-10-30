import type { Program } from "@/lib/domain";
export type LoyaltyRole = "owner" | "staff" | "consumer";
export type LoyaltyAction = "stamp" | "redeem" | "request" | "approve" | "reject";
export type Card = {
  pending_requests: { id: string; reason: string; target_id: string; created_at: string }[];
  card_code: string;
  name: string;
  stamps: number;
  stamp_expires_at: string | null;
  program: Program;
  rewards: {
    id: string;
    reward_text: string;
    stamp_target: number;
    issued_at: string;
    expires_at: string | null;
    status: "available" | "redeemed" | "expired" | "voided";
  }[];
  history: {
    id: string;
    action: LoyaltyAction;
    created_at: string;
    reversed: boolean;
    reason: string | null;
    target_id: string | null;
    resolution: "pending" | "approve" | "reject" | null;
    correction_pending: boolean;
  }[];
};
export type LoyaltyResponse = {
  card: Card;
  role: LoyaltyRole;
  roster?: { name: string; card_code: string }[];
};
export const loyaltyMessages: Record<string, string> = {
  NOT_AUTHORIZED: "No tienes permiso para esta acción.",
  NOT_AVAILABLE: "Tarjeta no disponible en este comercio.",
  OWNER_REQUIRED: "Solo el dueño puede autorizar correcciones.",
  KEY_REUSED: "El identificador de operación ya se usó con otros datos.",
  PAYMENT_CONFIRMATION_REQUIRED: "Confirma que la cuenta está pagada y cumple el mínimo.",
  REWARD_UNAVAILABLE: "Este premio ya no está disponible para canjear.",
  CORRECTION_UNAVAILABLE: "Esta operación ya no se puede corregir.",
  CORRECTION_PENDING: "Ya hay una solicitud pendiente para esa operación.",
  REQUEST_UNAVAILABLE: "La solicitud ya se resolvió o no está disponible.",
  REASON_REQUIRED: "Escribe el motivo (entre 4 y 500 caracteres).",
  REVERSE_REDEMPTION_FIRST: "Primero solicita y autoriza la corrección del canje de ese premio.",
  PHONE_NOT_VERIFIED: "Primero hay que verificar el móvil.",
  REWARD_BATCH_LIMIT: "El cambio de objetivo requiere revisar los sellos antes de continuar.",
  INVALID_ACTION: "Revisa los datos de la operación.",
};
export function loyaltyError(message: string) {
  return (
    loyaltyMessages[message] ??
    "No se pudo completar la operación. Revisa la tarjeta antes de reintentar."
  );
}
