/**
 * 🧪 COMMANDES DE DÉMONSTRATION (fictives) pour le tableau de bord admin.
 * Générées de façon déterministe (toujours les mêmes) à partir du catalogue.
 * À remplacer par la base de données : voir getOrders() dans src/lib/analytics.ts.
 */
import { cities } from "@/config/site";
import { products } from "@/data/products";
import { shippingFor } from "@/lib/format";

export type OrderStatus = "en attente" | "confirmée" | "livrée" | "annulée";

export type Order = {
  id: string;
  /** Date au format YYYY-MM-DD */
  date: string;
  city: string;
  status: OrderStatus;
  items: { productId: string; quantity: number; unitPrice: number }[];
  shipping: number;
};

/** Générateur pseudo-aléatoire à graine fixe (mulberry32). */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(88);
const totalWeight = products.reduce((sum, p) => sum + p.reviewsCount, 0);

/** Les produits avec beaucoup d'avis sont commandés plus souvent. */
function randomProduct() {
  let r = rand() * totalWeight;
  for (const p of products) {
    r -= p.reviewsCount;
    if (r <= 0) return p;
  }
  return products[products.length - 1];
}

const REFERENCE_DATE = Date.UTC(2026, 9, 29);
const DAY = 86_400_000;

export const mockOrders: Order[] = Array.from({ length: 64 }, (_, i) => {
  const quantities = new Map<string, number>();
  const lineCount = 1 + Math.floor(rand() * 3);
  for (let k = 0; k < lineCount; k++) {
    const p = randomProduct();
    quantities.set(p.id, (quantities.get(p.id) ?? 0) + (rand() < 0.2 ? 2 : 1));
  }
  const items = Array.from(quantities, ([productId, quantity]) => ({
    productId,
    quantity,
    unitPrice: products.find((p) => p.id === productId)!.price,
  }));
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const s = rand();
  const status: OrderStatus = s < 0.08 ? "annulée" : s < 0.18 ? "en attente" : s < 0.4 ? "confirmée" : "livrée";
  return {
    id: `CMD-${1001 + i}`,
    date: new Date(REFERENCE_DATE - Math.floor(rand() * 30) * DAY).toISOString().slice(0, 10),
    city: cities[Math.floor(rand() * cities.length)],
    status,
    items,
    shipping: shippingFor(subtotal),
  };
}).sort((a, b) => b.date.localeCompare(a.date));
