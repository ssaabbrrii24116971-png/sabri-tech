"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/format";
import { pixel } from "@/lib/meta-pixel";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

export function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const disabled = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(product.id, 1, product.colors?.[0]);
        pixel.addToCart(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={cn(
        "btn w-full",
        compact ? "px-3 py-2.5 text-xs sm:text-sm" : "",
        disabled ? "bg-slate-100 text-slate-400" : added ? "bg-emerald-500 text-white" : "bg-ink text-white hover:bg-brand-500",
      )}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {disabled ? t.product.outOfStock : compact ? t.product.add : t.product.addToCart}
    </button>
  );
}
