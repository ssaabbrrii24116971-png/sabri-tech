import type { Metadata } from "next";
import Image from "next/image";
import { Activity, Package, ReceiptText, ShoppingCart, TriangleAlert, Wallet } from "lucide-react";
import { getOrders, getSalesSummary, orderTotal } from "@/lib/analytics";
import { cn, formatPrice } from "@/lib/format";
import { pixelId } from "@/lib/meta-pixel";
import type { OrderStatus } from "@/data/mock-orders";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };

const statusStyle: Record<OrderStatus, string> = {
  "en attente": "bg-amber-50 text-amber-700",
  confirmée: "bg-brand-50 text-brand-700",
  livrée: "bg-emerald-50 text-emerald-700",
  annulée: "bg-slate-100 text-slate-500",
};

export default function AdminDashboardPage() {
  const orders = getOrders();
  const summary = getSalesSummary(orders);

  const kpis = [
    { icon: Wallet, label: "Chiffre d'affaires", value: formatPrice(summary.revenue), hint: "Livraison comprise, hors annulations" },
    { icon: ReceiptText, label: "Commandes", value: String(summary.totalOrders), hint: `dont ${summary.cancelledOrders} annulée(s)` },
    { icon: ShoppingCart, label: "Panier moyen", value: formatPrice(Math.round(summary.averageOrder)), hint: "Par commande non annulée" },
    { icon: Package, label: "Articles vendus", value: String(summary.unitsSold), hint: "Hors annulations" },
  ];

  return (
    <div className="container py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500">30 derniers jours</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
            pixelId ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
          )}
        >
          <Activity className="h-3.5 w-3.5" />
          {pixelId ? `Meta Pixel actif · ${pixelId}` : "Meta Pixel non configuré"}
        </span>
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Données de démonstration : ces commandes sont fictives. Les vrais chiffres apparaîtront une fois la base de données branchée.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, hint }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Icon className="h-4 w-4 text-brand-500" />
              {label}
            </div>
            <p className="mt-3 font-display text-2xl font-bold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold">Produits les plus commandés</h2>
          <ol className="mt-4 divide-y divide-slate-100">
            {summary.topProducts.map(({ product, quantity, revenue, share }, i) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <span className="w-5 text-sm font-bold text-slate-400">{i + 1}</span>
                <Image src={product.images[0]} alt="" width={44} height={44} className="rounded-lg bg-slate-100" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product.name}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(4, share * 100)}%` }} />
                  </div>
                </div>
                <div className="text-end text-sm">
                  <p className="font-semibold tabular-nums">{quantity} vendus</p>
                  <p className="text-xs text-slate-500 tabular-nums">{formatPrice(revenue)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold">Dernières commandes</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {orders.slice(0, 8).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold">{o.id}</p>
                  <p className="text-xs text-slate-500">
                    {o.date} · {o.city}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusStyle[o.status])}>{o.status}</span>
                  <span className="w-20 text-end font-semibold tabular-nums">{formatPrice(orderTotal(o))}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
