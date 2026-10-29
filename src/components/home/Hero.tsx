import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { t } from "@/i18n";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <div className="absolute -end-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-500/30 blur-[120px]" aria-hidden />
      <div className="absolute -bottom-40 -start-20 h-[360px] w-[360px] rounded-full bg-brand-600/20 blur-[100px]" aria-hidden />

      <div className="container relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t.hero.badge}
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              {t.hero.title.split(" ").slice(-2).join(" ")}
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/produits" className="btn-primary px-6 py-3.5 text-base">
              {t.hero.cta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link href="/produits?tag=promo" className="btn border border-white/15 bg-white/5 px-6 py-3.5 text-base text-white hover:bg-white/10">
              <BadgePercent className="h-4 w-4" />
              {t.hero.ctaSecondary}
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <dt className="text-xs text-slate-400">{t.hero.stat1}</dt>
              <dd className="font-display text-2xl font-bold">{products.length}+</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">{t.hero.stat2}</dt>
              <dd className="font-display text-2xl font-bold">24</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">{t.hero.stat3}</dt>
              <dd className="font-display text-2xl font-bold">
                12 <span className="text-sm font-medium text-slate-400">{t.hero.months}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
          <div className="absolute inset-8 rounded-full border border-brand-400/20" aria-hidden />
          <div className="absolute inset-20 rounded-full border border-brand-400/10" aria-hidden />
          <Image src="/images/hero.svg" alt="" fill priority sizes="(min-width:1024px) 40vw, 90vw" className="animate-float object-contain" />
        </div>
      </div>
    </section>
  );
}
