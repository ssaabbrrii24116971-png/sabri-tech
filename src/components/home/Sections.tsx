import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headset, Quote, ShieldCheck, Truck, Wallet } from "lucide-react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { fmt, t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Stars } from "@/components/product/ProductBits";

export function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-slate-500 sm:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
          {t.sections.seeAll}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

export function CategoryGrid() {
  return (
    <section className="container py-14 sm:py-20">
      <SectionHeader title={t.sections.categories} subtitle={t.sections.categoriesSub} href="/produits" />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/produits?categorie=${c.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-ink transition duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="border-t border-white/5 p-4 text-white">
                <h3 className="font-display font-bold leading-tight">{c.name}</h3>
                <p className="mt-0.5 text-xs text-slate-300">{count} produits</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ProductSection({
  title,
  subtitle,
  href,
  items,
  muted = false,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  items: Product[];
  muted?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className={muted ? "bg-slate-50" : ""}>
      <div className="container py-14 sm:py-20">
        <SectionHeader title={title} subtitle={subtitle} href={href} />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromoBand() {
  return (
    <section className="container py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white sm:p-12">
        <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
        <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-4xl">{t.promoBand.title}</h2>
            <p className="mt-2 text-brand-100">{t.promoBand.text}</p>
          </div>
          <Link href="/produits?categorie=ecouteurs" className="btn bg-white px-6 py-3.5 text-base text-brand-700 hover:bg-brand-50">
            {t.promoBand.cta}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ServiceInfo() {
  const { delay, freeFrom } = siteConfig.shipping;
  const items = [
    { icon: Truck, title: t.service.deliveryTitle, text: fmt(t.service.deliveryText, { delay, amount: formatPrice(freeFrom) }) },
    { icon: Wallet, title: t.service.codTitle, text: t.service.codText },
    { icon: Headset, title: t.service.supportTitle, text: fmt(t.service.supportText, { hours: siteConfig.openingHours }) },
    { icon: ShieldCheck, title: t.service.warrantyTitle, text: t.service.warrantyText },
  ];
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ⚠️ Avis d'exemple (fictifs) — remplacez-les par de vrais avis clients. */
const reviews = [
  { name: "Amine B.", city: "Sfax", rating: 5, text: "Montre reçue en 48h, très bonne qualité pour le prix. Le livreur était ponctuel." },
  { name: "Ines K.", city: "Tunis", rating: 5, text: "Commande passée sur WhatsApp en deux minutes, on m'a rappelée tout de suite pour confirmer." },
  { name: "Youssef M.", city: "Sousse", rating: 4, text: "Le chargeur 20W charge vraiment vite mon iPhone. Paiement à la livraison, c'est rassurant." },
];

export function Reviews() {
  return (
    <section className="bg-ink text-white">
      <div className="container py-14 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="section-title">{t.sections.reviews}</h2>
          <p className="mt-1.5 text-sm text-slate-400">{t.sections.reviewsSub}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Quote className="h-7 w-7 text-brand-400" />
              <blockquote className="mt-4 text-slate-200">{r.text}</blockquote>
              <figcaption className="mt-5 flex items-center justify-between">
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <span className="text-xs text-slate-400">{r.city}</span>
                </span>
                <Stars rating={r.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
