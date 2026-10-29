"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { fmt, t } from "@/i18n";
import { searchProducts } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";

export function SearchBox({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapper = useRef<HTMLFormElement>(null);
  const listId = useId();

  const results = useMemo(() => (query.trim().length >= 2 ? searchProducts(query).slice(0, 5) : []), [query]);

  useEffect(() => setQuery(params.get("q") ?? ""), [params]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) return go(`/produit/${results[active].slug}`);
    const q = query.trim();
    go(q ? `/produits?q=${encodeURIComponent(q)}` : "/produits");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <form ref={wrapper} role="search" onSubmit={submit} className={cn("relative", className)}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        {t.search.submit}
      </label>
      <input
        id={`${listId}-input`}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={t.search.placeholder}
        autoComplete="off"
        maxLength={80}
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        className="input h-11 rounded-full bg-slate-50 pe-12 ps-5"
      />
      <button
        type="submit"
        aria-label={t.search.submit}
        className="absolute end-1 top-1 grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && query.trim().length >= 2 && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card animate-fade-up"
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-slate-500">{t.search.noResult}</p>
          ) : (
            <ul>
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === active}>
                  <Link
                    href={`/produit/${p.slug}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className={cn("flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50", i === active && "bg-slate-50")}
                  >
                    <Image src={p.images[0]} alt="" width={44} height={44} className="rounded-lg bg-slate-100" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
                    <span className="text-sm font-bold text-brand-600">{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="block w-full border-t border-slate-100 px-4 py-3 text-start text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            {fmt(t.search.seeAll, { q: query.trim() })}
          </button>
        </div>
      )}
    </form>
  );
}
