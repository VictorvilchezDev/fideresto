import { Check, Gem } from "lucide-react";
import type { WalletSnapshot } from "@/lib/wallet/model";
export function PassPreview({ card }: { card: WalletSnapshot }) {
  return (
    <div className="wallet-pass-preview" aria-label="Vista previa de tarjeta Wallet">
      <div className="wallet-pass-head">
        <span className="wallet-pass-logo">
          <Gem size={25} />
        </span>
        <span>{card.merchantName}</span>
        <small>{card.sample ? "PRUEBA" : "FIDELIZACIÓN"}</small>
      </div>
      <div className="wallet-pass-progress">
        <strong>{card.stamps}</strong>
        <span> / {card.target} sellos</span>
      </div>
      <div className="wallet-pass-stamps">
        {Array.from({ length: Math.min(card.target, 12) }, (_, i) => (
          <span key={i} className={i < card.stamps ? "earned" : ""}>
            {i < card.stamps ? <Check size={18} /> : i + 1}
          </span>
        ))}
      </div>
      <span className="eyebrow">PRÓXIMO PREMIO</span>
      <h2>{card.rewardText}</h2>
      <small>Vista previa. Apple y Google adaptan el diseño al mostrar la tarjeta.</small>
    </div>
  );
}
