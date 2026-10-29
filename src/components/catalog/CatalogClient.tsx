"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, getCategory } from "@/data/categories";
import { fmt, t } from "@/i18n";
import { getAllProducts, getBrands, getPriceBounds, searchProducts } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

const sorts = {
  populaires: t.catalog.sortPopular,
  "prix-asc": t.catalog.sortPriceAsc,
  "prix-desc": t.catalog.sortPriceDesc,
  nouveautes: t.catalog.sortNew,
  notes: t.catalog.sortRating,
} as const;
type SortKey = keyof typeof sorts;

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  populaires: (a, b) => b.reviewsCount - a.reviewsCount,
  "prix-asc": (a, b) => a.price - b.price,
  "prix-desc": (a, b) => b.price - a.price,
  nouveautes: (a, b) => b.addedAt.localeCompare(a.addedAt),
  notes: (a, b) => b.rating - a.rating,
};

export function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const bounds = getPriceBounds();
  const brands = getBrands();

  // Lecture des filtres depuis l'URL (liens partageables)
  const q = params.get("q") ?? "";
  const category = params.get("categorie") ?? "";
  const selectedBrands = (params.get("marque") ?? "").split(",").filter(Boolean);
  const maxPrice = Number(params.get("prix")) || bounds.max;
  const inStock = params.get("stock") === "1";
  const promo = params.get("tag") === "promo";
  const sort: SortKey = (params.get("tri") as SortKey) in sorts ? (params.get("tri") as SortKey) : "populaires";

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleBrand = (b: string) => {
    const set = new Set(selectedBrands);
    if (set.has(b)) set.delete(b);
    else set.add(b);
    update({ marque: Array.from(set).join(",") || null });
  };

  const results = useMemo(() => {
    let list = searchProducts(q, getAllProducts());
    if (category) list = list.filter((p) => p.category === category);
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    list = list.filter((p) => p.price <= maxPrice);
    if (inStock) list = list.filter((p) => p.stock > 0);
    if (promo) list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
    return [...list].sort(sorters[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, selectedBrands.join(","), maxPrice, inStock, promo, sort]);

  const activeCount =
    (category ? 1 : 0) + selectedBrands.length + (maxPrice < bounds.max ? 1 : 0) + (inStock ? 1 : 0) + (promo ? 1 : 0);

  const title = q ? fmt(t.catalog.searchFor, { q }) : category ? getCategory(category)?.name ?? t.catalog.title : promo ? t.nav.deals : t.catalog.title;

  const filters = (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-sm font-bold">{t.catalog.category}</legend>
        <div className="space-y-1">
          {[{ slug: "", name: t.catalog.allCategories }, ...categories].map((c) => (
            <button
              key={c.slug || "all"}
              type="button"
              onClick={() => update({ categorie: c.slug || null })}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-start text-sm transition",
                category === c.slug ? "bg-brand-50 font-semibold text-brand-700" : "hover:bg-slate-50",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex w-full justify-between text-sm font-bold">
          {t.catalog.price}
          <span className="font-semibold text-brand-600">{formatPrice(maxPrice)}</span>
        </legend>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={maxPrice}
          onChange={(e) => update({ prix: Number(e.target.value) >= bounds.max ? null : e.target.value })}
          className="w-full accent-brand-500"
          aria-label={t.catalog.price}
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{formatPrice(bounds.min)}</span>
          <span>{formatPrice(bounds.max)}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-bold">{t.catalog.brand}</legend>
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="h-4 w-4 rounded accent-brand-500" />
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-bold">{t.catalog.availability}</legend>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" checked={inStock} onChange={() => update({ stock: inStock ? null : "1" })} className="h-4 w-4 accent-brand-500" />
            {t.catalog.inStockOnly}
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" checked={promo} onChange={() => update({ tag: promo ? null : "promo" })} className="h-4 w-4 accent-brand-500" />
            {t.catalog.promoOnly}
          </label>
        </div>
      </fieldset>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false })}
          className="btn-outline w-full"
        >
          {t.catalog.reset}
        </button>
      )}
    </div>
  );

  return (
    <div className="container py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{fmt(t.catalog.results, { n: results.length })}</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" onClick={() => setSheetOpen(true)} className="btn-outline flex-1 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            {t.catalog.filters}
            {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] text-white">{activeCount}</span>}
          </button>
          <label className="sr-only" htmlFor="sort">{t.catalog.sort}</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => update({ tri: e.target.value === "populaires" ? null : e.target.value })}
            className="input flex-1 cursor-pointer py-2.5 sm:w-52"
          >
            {Object.entries(sorts).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-36">{filters}</div>
        </aside>

        <div className="flex-1">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
              <p>{t.catalog.empty}</p>
              <button type="button" onClick={() => router.replace(pathname)} className="btn-primary mt-4">
                {t.catalog.reset}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtres mobile */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t.catalog.filters}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white animate-fade-up">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-lg font-bold">{t.catalog.filters}</h2>
              <button type="button" onClick={() => setSheetOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100" aria-label={t.nav.close}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filters}</div>
            <div className="border-t border-slate-100 p-4">
              <button type="button" onClick={() => setSheetOpen(false)} className="btn-primary w-full py-3.5">
                {t.catalog.apply} ({results.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
