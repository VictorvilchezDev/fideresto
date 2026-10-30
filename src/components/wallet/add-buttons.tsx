import { Smartphone, Wallet } from "lucide-react";
import type { WalletReadiness } from "@/lib/wallet/config";
export function AddWalletButtons({
  status,
  base,
  enabled = true,
}: {
  status: WalletReadiness;
  base: string;
  enabled?: boolean;
}) {
  return (
    <div className="wallet-add-options">
      {(
        [
          { id: "apple", label: "Añadir a Apple Wallet", icon: Smartphone },
          { id: "google", label: "Añadir a Google Wallet", icon: Wallet },
        ] as const
      ).map((p) => (
        <div key={p.id}>
          {status[p.id].ready && enabled ? (
            <a className="button wallet-add-button" href={`${base}/${p.id}`}>
              <p.icon size={21} />
              {p.label}
            </a>
          ) : (
            <button className="wallet-add-button" disabled>
              <p.icon size={21} />
              {p.label}
            </button>
          )}
          <p>{status[p.id].message}</p>
        </div>
      ))}
    </div>
  );
}
