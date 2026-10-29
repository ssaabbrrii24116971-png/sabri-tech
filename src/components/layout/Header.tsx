"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { t } from "@/i18n";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import { useCart } from "@/store/cart";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

const links = [
  { href: "/", label: t.nav.home },
  { href: "/produits", label: t.nav.shop },
  { href: "/produits?tag=promo", label: t.nav.deals },
  { href: "/produits?tri=nouveautes", label: t.nav.new },
  { href: "/livraison", label: t.nav.delivery },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCart((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl transition-shadow",
        scrolled ? "border-slate-200 shadow-[0_4px_20px_-12px_rgba(8,15,32,.25)]" : "border-transparent",
      )}
    >
      <div className="container flex h-16 items-center gap-3 lg:h-[72px] lg:gap-8">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ms-2 grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 lg:hidden"
          aria-label={t.nav.menu}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo />

        <Suspense fallback={<div className="hidden flex-1 lg:block" />}>
          <SearchBox className="hidden max-w-xl flex-1 md:block" />
        </Suspense>

        <div className="ms-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 md:hidden"
            aria-label={t.search.submit}
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"
            aria-label={t.cart.open}
          >
            <ShoppingBag className="h-5 w-5" />
            {hydrated && count > 0 && (
              <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="container pb-3 md:hidden">
          <Suspense>
            <SearchBox onNavigate={() => setSearchOpen(false)} />
          </Suspense>
        </div>
      )}

      {/* Navigation bureau */}
      <nav className="hidden border-t border-slate-100 lg:block" aria-label="Navigation principale">
        <div className="container flex h-12 items-center gap-1 text-sm font-medium">
          <div className="group relative">
            <button type="button" className="flex h-12 items-center gap-1.5 rounded-lg px-3 text-ink hover:text-brand-600">
              {t.nav.categories}
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute start-0 top-full z-50 w-[520px] translate-y-2 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/produits?categorie=${c.slug}`}
                    className="rounded-xl p-3 transition hover:bg-brand-50"
                  >
                    <span className="block font-semibold text-ink">{c.name}</span>
                    <span className="block text-xs text-slate-500">{c.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 transition hover:text-brand-600",
                pathname === l.href ? "text-brand-600" : "text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col bg-white animate-fade-up">
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"
                aria-label={t.nav.close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 font-semibold hover:bg-slate-50"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">{t.nav.categories}</p>
              <nav className="space-y-1">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/produits?categorie=${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
