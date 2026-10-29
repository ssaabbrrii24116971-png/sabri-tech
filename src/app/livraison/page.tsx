import type { Metadata } from "next";
import { RotateCcw, Truck, Wallet } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fmt, t } from "@/i18n";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: t.delivery.title };

export default function DeliveryPage() {
  const { delay, fee, freeFrom } = siteConfig.shipping;
  const blocks = [
    { icon: Truck, title: t.delivery.shippingTitle, text: fmt(t.delivery.shipping, { delay, fee: formatPrice(fee), amount: formatPrice(freeFrom) }) },
    { icon: Wallet, title: t.delivery.paymentTitle, text: t.delivery.payment },
    { icon: RotateCcw, title: t.delivery.returnsTitle, text: t.delivery.returns },
  ];
  return (
    <div className="container max-w-3xl py-12 sm:py-16">
      <h1 className="section-title">{t.delivery.title}</h1>

      <section id="commander" className="mt-10 scroll-mt-40">
        <h2 className="mb-4 font-display text-xl font-bold">{t.delivery.howTitle}</h2>
        <ol className="space-y-3">
          {t.delivery.how.map((step, i) => (
            <li key={step} className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">{i + 1}</span>
              <span className="pt-1 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 space-y-6">
        {blocks.map(({ icon: Icon, title, text }) => (
          <section key={title} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{title}</h2>
              <p className="mt-1 leading-relaxed text-slate-600">{text}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
