import { Star } from "lucide-react";
import { fmt, t } from "@/i18n";
import { discountPercent } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function Stars({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-label={`${rating} / 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn("h-3.5 w-3.5", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-slate-500">({count})</span>}
    </div>
  );
}

export function Price({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-bold text-ink", size === "lg" ? "text-3xl" : "text-lg")}>{formatPrice(product.price)}</span>
      {product.oldPrice && product.oldPrice > product.price && (
        <span className={cn("text-slate-400 line-through", size === "lg" ? "text-lg" : "text-sm")}>
          {formatPrice(product.oldPrice)}
        </span>
      )}
    </div>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0)
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {t.product.outOfStock}
      </span>
    );
  if (stock <= 5)
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        {fmt(t.product.lowStock, { n: stock })}
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {t.product.inStock}
    </span>
  );
}

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const discount = discountPercent(product);
  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      {discount > 0 && <span className="chip bg-red-500 text-white">-{discount}%</span>}
      {product.tags.includes("new") && <span className="chip bg-brand-500 text-white">{t.product.new}</span>}
      {product.tags.includes("bestseller") && <span className="chip bg-ink text-white">{t.product.bestseller}</span>}
    </div>
  );
}
