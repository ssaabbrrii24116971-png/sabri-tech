"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { dir, fmt, t } from "@/i18n";
import { cn, formatPrice } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import { computeTotals, toOrderLines, useCart } from "@/store/cart";
import { CartLines } from "./CartLines";
import { FreeShippingBar } from "./FreeShippingBar";

export function CartDrawer() {
  const hydrated = useHydrated();
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const pathname = usePathname();

  const lines = toOrderLines(items);
  const totals = computeTotals(lines);

  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!hydrated || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t.cart.title}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={close} />
      <aside
        className={cn(
          "absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-white shadow-2xl",
          dir === "rtl" ? "animate-slide-in-rtl" : "animate-slide-in",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <h2 className="font-display text-lg font-bold">
            {t.cart.title}
            {totals.count > 0 && <span className="ms-2 text-sm font-medium text-slate-500">· {fmt(t.cart.items, { n: totals.count })}</span>}
          </h2>
          <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100" aria-label={t.nav.close}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <p className="text-slate-600">{t.cart.empty}</p>
            <Link href="/produits" onClick={close} className="btn-primary">
              {t.cart.continue}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <div className="pt-4">
                <FreeShippingBar subtotal={totals.subtotal} />
              </div>
              <CartLines lines={lines} onNavigate={close} />
            </div>
            <div className="space-y-3 border-t border-slate-100 p-5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t.cart.subtotal}</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t.cart.shipping}</span>
                <span>{totals.shipping === 0 ? t.cart.free : formatPrice(totals.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>{t.cart.total}</span>
                <span className="text-brand-600">{formatPrice(totals.total)}</span>
              </div>
              <Link href="/panier" onClick={close} className="btn-primary w-full py-3.5 text-base">
                {t.cart.checkout}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <button type="button" onClick={close} className="w-full py-1 text-sm font-medium text-slate-500 hover:text-ink">
                {t.cart.continue}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
