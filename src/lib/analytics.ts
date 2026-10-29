/**
 * Calcul des statistiques de vente pour le tableau de bord admin.
 * Pour brancher la base de données, remplacez seulement getOrders().
 */
import { mockOrders, type Order } from "@/data/mock-orders";
import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function getOrders(): Order[] {
  return mockOrders;
}

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0) + order.shipping;
}

export type TopProduct = { product: Product; quantity: number; revenue: number; share: number };

export type SalesSummary = {
  /** Chiffre d'affaires des commandes non annulées, livraison comprise (TND) */
  revenue: number;
  totalOrders: number;
  cancelledOrders: number;
  averageOrder: number;
  unitsSold: number;
  topProducts: TopProduct[];
};

/** Les commandes annulées comptent dans le nombre total mais pas dans le chiffre d'affaires ni les ventes. */
export function getSalesSummary(orders: Order[], topN = 5): SalesSummary {
  const valid = orders.filter((o) => o.status !== "annulée");
  const revenue = valid.reduce((sum, o) => sum + orderTotal(o), 0);

  const byProduct = new Map<string, { quantity: number; revenue: number }>();
  for (const order of valid) {
    for (const it of order.items) {
      const row = byProduct.get(it.productId) ?? { quantity: 0, revenue: 0 };
      row.quantity += it.quantity;
      row.revenue += it.unitPrice * it.quantity;
      byProduct.set(it.productId, row);
    }
  }
  const unitsSold = Array.from(byProduct.values()).reduce((n, r) => n + r.quantity, 0);

  const topProducts = Array.from(byProduct, ([id, row]) => ({ product: getProductById(id), ...row }))
    .filter((r): r is Omit<TopProduct, "share"> => r.product !== undefined)
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, topN)
    .map((r) => ({ ...r, share: unitsSold ? r.quantity / unitsSold : 0 }));

  return {
    revenue,
    totalOrders: orders.length,
    cancelledOrders: orders.length - valid.length,
    averageOrder: valid.length ? revenue / valid.length : 0,
    unitsSold,
    topProducts,
  };
}
