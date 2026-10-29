"use client";

import { useRouter } from "next/navigation";
import { Check, ShoppingBag, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { fmt, t } from "@/i18n";
import { cn, formatPrice } from "@/lib/format";
import { pixel } from "@/lib/meta-pixel";
import type { Product } from "@/lib/types";
import { buildProductQuestion, buildWhatsAppLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { QuantityInput } from "@/components/cart/QuantityInput";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

export function ProductBuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [color, setColor] = useState(product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const saving = product.oldPrice ? product.oldPrice - product.price : 0;

  const addToCart = () => {
    add(product.id, qty, color);
    pixel.addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => {
    add(product.id, qty, color);
    pixel.addToCart(product, qty);
    useCart.getState().close();
    router.push("/panier");
  };

  return (
    <div className="space-y-6">
      {saving > 0 && (
        <span className="chip bg-red-50 text-red-600">{fmt(t.product.save, { amount: formatPrice(saving) })}</span>
      )}

      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">
            {t.product.color} : <span className="font-normal text-slate-600">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={c === color}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-medium transition",
                  c === color ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 hover:border-slate-300",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {!soldOut && (
        <div>
          <p className="mb-2 text-sm font-semibold">{t.product.quantity}</p>
          <QuantityInput value={qty} max={product.stock} onChange={(v) => setQty(Math.max(1, Math.min(v, product.stock)))} />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={addToCart} disabled={soldOut} className={cn(added ? "btn bg-emerald-500 text-white" : "btn-dark", "py-3.5")}>
          {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
          {soldOut ? t.product.outOfStock : t.product.addToCart}
        </button>
        <button type="button" onClick={buyNow} disabled={soldOut} className="btn-primary py-3.5">
          <Zap className="h-5 w-5" />
          {t.product.buyNow}
        </button>
      </div>
      <a
        href={buildWhatsAppLink(buildProductQuestion(product))}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp w-full py-3.5"
      >
        <WhatsAppIcon />
        {t.product.askWhatsApp}
      </a>

      <p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
        <Truck className="h-5 w-5 shrink-0 text-brand-500" />
        {fmt(t.product.deliveryInfo, { delay: siteConfig.shipping.delay })}
      </p>

      {/* Barre d'achat collante sur mobile */}
      {!soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">{product.name}</p>
            <p className="whitespace-nowrap font-bold">{formatPrice(product.price)}</p>
          </div>
          <button type="button" onClick={buyNow} className="btn-primary me-16 shrink-0 whitespace-nowrap px-3">
            <Zap className="h-4 w-4" />
            {t.product.buyNow}
          </button>
        </div>
      )}
    </div>
  );
}
