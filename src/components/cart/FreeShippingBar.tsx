import { Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fmt, t } from "@/i18n";
import { formatPrice } from "@/lib/format";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const { freeFrom } = siteConfig.shipping;
  if (freeFrom <= 0) return null;
  const left = Math.max(0, freeFrom - subtotal);
  const pct = Math.min(100, (subtotal / freeFrom) * 100);
  return (
    <div className="rounded-xl bg-brand-50 p-3">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-800">
        <Truck className="h-4 w-4" />
        {left > 0 ? fmt(t.cart.freeLeft, { amount: formatPrice(left) }) : t.cart.freeReached}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-brand-100">
        <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
