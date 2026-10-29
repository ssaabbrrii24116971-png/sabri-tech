import { Phone, Truck, Wallet } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fmt, t } from "@/i18n";
import { formatPrice } from "@/lib/format";

export function TopBar() {
  const { delay, freeFrom } = siteConfig.shipping;
  return (
    <div className="bg-ink text-[12px] text-slate-300">
      <div className="container flex h-9 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <span className="flex items-center gap-1.5 truncate">
            <Truck className="h-3.5 w-3.5 shrink-0 text-brand-400" />
            {fmt(t.topbar.delivery, { delay })}
          </span>
          {freeFrom > 0 && (
            <span className="hidden items-center gap-1.5 md:flex">
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              {fmt(t.topbar.freeFrom, { amount: formatPrice(freeFrom) })}
            </span>
          )}
          <span className="hidden items-center gap-1.5 lg:flex">
            <Wallet className="h-3.5 w-3.5 text-brand-400" />
            {t.topbar.cod}
          </span>
        </div>
        <a
          href={`tel:+${siteConfig.whatsappNumber}`}
          className="hidden shrink-0 items-center gap-1.5 hover:text-white sm:flex"
          dir="ltr"
        >
          <Phone className="h-3.5 w-3.5 text-brand-400" />
          {siteConfig.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

export function DemoBanner() {
  if (!siteConfig.demoMode) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
      {t.demo}
    </div>
  );
}
