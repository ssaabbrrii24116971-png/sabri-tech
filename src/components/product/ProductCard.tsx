import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { Price, ProductBadges, Stars, StockBadge } from "./ProductBits";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
      <Link href={`/produit/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        )}
        <ProductBadges product={product} className="absolute start-3 top-3" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{product.brand}</p>
        <Link href={`/produit/${product.slug}`} className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug hover:text-brand-600">
          {product.name}
        </Link>
        <Stars rating={product.rating} count={product.reviewsCount} />
        <Price product={product} />
        <StockBadge stock={product.stock} />
        <div className="mt-auto pt-2">
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
