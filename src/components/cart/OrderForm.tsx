"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, TriangleAlert, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cities } from "@/config/site";
import { t } from "@/i18n";
import { cn, formatPrice } from "@/lib/format";
import { pixel } from "@/lib/meta-pixel";
import { useHydrated } from "@/lib/use-hydrated";
import type { CustomerInfo } from "@/lib/types";
import { buildOrderMessage, buildWhatsAppLink, isPlaceholderNumber, isValidTunisianPhone } from "@/lib/whatsapp";
import { computeTotals, toOrderLines, useCart } from "@/store/cart";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { CartLines } from "./CartLines";
import { FreeShippingBar } from "./FreeShippingBar";

type Errors = Partial<Record<keyof CustomerInfo, string>>;

function validate(c: CustomerInfo): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 3) e.name = t.order.errName;
  if (!isValidTunisianPhone(c.phone)) e.phone = t.order.errPhone;
  if (!c.city) e.city = t.order.errCity;
  if (c.address.trim().length < 6) e.address = t.order.errAddress;
  return e;
}

export function OrderForm() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const lines = toOrderLines(items);
  const totals = computeTotals(lines);

  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", phone: "", city: "", address: "", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sentLink, setSentLink] = useState<string | null>(null);
  const checkoutTracked = useRef(false);
  const lastPurchase = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || checkoutTracked.current || lines.length === 0) return;
    checkoutTracked.current = true;
    pixel.initiateCheckout(lines, totals.total);
  }, [hydrated, lines, totals.total]);

  const set = (k: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCustomer((c) => ({ ...c, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(customer);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    const link = buildWhatsAppLink(buildOrderMessage(lines, totals, customer));
    // Un seul Purchase par commande, même si le client clique plusieurs fois.
    if (lastPurchase.current !== link) {
      lastPurchase.current = link;
      pixel.purchase(lines, totals.total, `order-${Date.now().toString(36)}`);
    }
    window.open(link, "_blank", "noopener,noreferrer");
    setSentLink(link);
    requestAnimationFrame(() => document.getElementById("order-sent")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  if (!hydrated) return <div className="container py-20 text-center text-slate-400">…</div>;

  if (lines.length === 0 && !sentLink) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h1 className="section-title">{t.cart.empty}</h1>
        <p className="text-slate-500">{t.order.emptyCart}</p>
        <Link href="/produits" className="btn-primary">{t.cart.continue}</Link>
      </div>
    );
  }

  const field = (k: keyof CustomerInfo) =>
    cn("input", errors[k] && "border-red-400 focus:border-red-500 focus:ring-red-500/15");

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="section-title">{t.order.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-500">{t.order.subtitle}</p>

      {isPlaceholderNumber() && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {t.order.placeholderWarning}
        </p>
      )}

      {sentLink && (
        <div id="order-sent" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" role="status">
          <p className="flex items-center gap-2 font-semibold text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            {t.order.sentTitle}
          </p>
          <p className="mt-1 text-sm text-emerald-900">{t.order.sentText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={sentLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-2.5">
              <WhatsAppIcon className="h-4 w-4" />
              {t.order.reopen}
            </a>
            {lines.length > 0 && (
              <button type="button" onClick={clear} className="btn-outline py-2.5">
                {t.cart.clear}
              </button>
            )}
            <Link href="/produits" className="btn-outline py-2.5">{t.cart.continue}</Link>
          </div>
        </div>
      )}

      {lines.length > 0 && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <form onSubmit={submit} noValidate className="order-2 space-y-5 rounded-3xl border border-slate-100 p-5 sm:p-8 lg:order-1">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="f-name" className="mb-1.5 block text-sm font-semibold">{t.order.name} *</label>
                <input id="f-name" value={customer.name} onChange={set("name")} autoComplete="name" maxLength={80} className={field("name")} aria-invalid={!!errors.name} />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="f-phone" className="mb-1.5 block text-sm font-semibold">{t.order.phone} *</label>
                <input id="f-phone" type="tel" inputMode="tel" dir="ltr" placeholder="98 123 456" value={customer.phone} onChange={set("phone")} autoComplete="tel" maxLength={20} className={field("phone")} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="f-city" className="mb-1.5 block text-sm font-semibold">{t.order.city} *</label>
              <select id="f-city" value={customer.city} onChange={set("city")} className={cn(field("city"), "cursor-pointer")} aria-invalid={!!errors.city}>
                <option value="">{t.order.chooseCity}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="f-address" className="mb-1.5 block text-sm font-semibold">{t.order.address} *</label>
              <input id="f-address" value={customer.address} onChange={set("address")} placeholder={t.order.addressPlaceholder} autoComplete="street-address" maxLength={200} className={field("address")} aria-invalid={!!errors.address} />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="f-note" className="mb-1.5 block text-sm font-semibold">{t.order.note}</label>
              <textarea id="f-note" value={customer.note} onChange={set("note")} placeholder={t.order.notePlaceholder} rows={3} maxLength={300} className="input resize-none" />
            </div>

            <p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <Wallet className="h-5 w-5 shrink-0 text-brand-500" />
              {t.order.codNotice}
            </p>

            <button type="submit" className="btn-whatsapp w-full py-4 text-base">
              <WhatsAppIcon />
              {t.order.submit} · {formatPrice(totals.total)}
            </button>
          </form>

          <aside className="order-1 lg:order-2">
            <div className="rounded-3xl bg-slate-50 p-5 sm:p-6 lg:sticky lg:top-36">
              <h2 className="mb-2 font-display text-lg font-bold">{t.order.summary}</h2>
              <FreeShippingBar subtotal={totals.subtotal} />
              <CartLines lines={lines} />
              <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.subtotal}</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.shipping}</span>
                  <span>{totals.shipping === 0 ? t.cart.free : formatPrice(totals.shipping)}</span>
                </div>
                <div className="flex justify-between pt-1 text-lg font-bold">
                  <span>{t.cart.total}</span>
                  <span className="text-brand-600">{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
