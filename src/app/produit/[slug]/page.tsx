import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { getCategory } from "@/data/categories";
import { fmt, t } from "@/i18n";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { TrackViewContent } from "@/components/analytics/MetaPixel";
import { ProductSection } from "@/components/home/Sections";
import { Price, ProductBadges, Stars, StockBadge } from "@/components/product/ProductBits";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { ProductGallery } from "@/components/product/ProductGallery";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: t.product.notFound };
  return { title: product.name, description: product.shortDescription, openGraph: { images: [product.images[0]] } };
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category);

  return (
    <>
      <TrackViewContent product={product} />
      <div className="container pb-24 pt-6 sm:pb-16 sm:pt-8">
        <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600">{t.nav.home}</Link>
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          <Link href="/produits" className="hover:text-brand-600">{t.nav.shop}</Link>
          {category && (
            <>
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
              <Link href={`/produits?categorie=${category.slug}`} className="hover:text-brand-600">{category.name}</Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative">
            <ProductGallery images={product.images} alt={product.name} />
            <ProductBadges product={product} className="pointer-events-none absolute start-4 top-4" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{product.brand}</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Stars rating={product.rating} />
              <span className="text-sm text-slate-500">
                {product.rating.toFixed(1)} · {fmt(t.product.reviews, { n: product.reviewsCount })}
              </span>
              <StockBadge stock={product.stock} />
            </div>
            <div className="mt-5">
              <Price product={product} size="lg" />
            </div>
            <p className="mt-4 leading-relaxed text-slate-600">{product.shortDescription}</p>

            {product.compatibility && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{t.product.compatibility} :</span>
                {product.compatibility.map((c) => (
                  <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{c}</span>
                ))}
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-6">
              <ProductBuyBox product={product} />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">{t.product.description}</h2>
            <p className="leading-relaxed text-slate-600">{product.description}</p>
            <h3 className="mb-3 mt-8 font-semibold">{t.product.features}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {f}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">{t.product.specs}</h2>
            <dl className="overflow-hidden rounded-2xl border border-slate-100">
              {Object.entries({ [t.product.brand]: product.brand, ...product.specs }).map(([k, v], i) => (
                <div key={k} className={`grid grid-cols-[40%_1fr] gap-4 px-5 py-3 text-sm ${i % 2 ? "bg-white" : "bg-slate-50"}`}>
                  <dt className="font-medium text-slate-500">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <ProductSection title={t.sections.related} items={getRelatedProducts(product)} muted />
    </>
  );
}
