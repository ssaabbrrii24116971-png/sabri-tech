"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import type { OrderLine } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { QuantityInput } from "./QuantityInput";

export function CartLines({ lines, onNavigate }: { lines: OrderLine[]; onNavigate?: () => void }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  return (
    <ul className="divide-y divide-slate-100">
      {lines.map(({ product, quantity, color }) => (
        <li key={`${product.id}-${color ?? ""}`} className="flex gap-3 py-4">
          <Link href={`/produit/${product.slug}`} onClick={onNavigate} className="shrink-0">
            <Image src={product.images[0]} alt={product.name} width={80} height={80} className="rounded-xl bg-slate-100" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/produit/${product.slug}`} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold hover:text-brand-600">
              {product.name}
            </Link>
            {color && <p className="mt-0.5 text-xs text-slate-500">{color}</p>}
            <p className="mt-1 text-sm font-bold text-brand-600">{formatPrice(product.price)}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <QuantityInput
                size="sm"
                value={quantity}
                max={product.stock}
                onChange={(q) => setQuantity(product.id, color, q)}
              />
              <button
                type="button"
                onClick={() => remove(product.id, color)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.cart.remove}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
