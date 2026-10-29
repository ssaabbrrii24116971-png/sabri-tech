"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getProductById } from "@/lib/catalog";
import { shippingFor } from "@/lib/format";
import type { CartItem } from "@/lib/types";
import type { OrderLine } from "@/lib/whatsapp";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (productId: string, quantity?: number, color?: string) => void;
  setQuantity: (productId: string, color: string | undefined, quantity: number) => void;
  remove: (productId: string, color?: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const sameLine = (a: CartItem, productId: string, color?: string) =>
  a.productId === productId && (a.color ?? "") === (color ?? "");

/** Plafonne la quantité au stock disponible (et à 99). */
function clampQty(productId: string, qty: number): number {
  const stock = getProductById(productId)?.stock ?? 0;
  return Math.max(0, Math.min(qty, stock, 99));
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (productId, quantity = 1, color) =>
        set((s) => {
          const existing = s.items.find((i) => sameLine(i, productId, color));
          const nextQty = clampQty(productId, (existing?.quantity ?? 0) + quantity);
          if (nextQty <= 0) return s;
          const items = existing
            ? s.items.map((i) => (sameLine(i, productId, color) ? { ...i, quantity: nextQty } : i))
            : [...s.items, { productId, quantity: nextQty, color }];
          return { items, isOpen: true };
        }),
      setQuantity: (productId, color, quantity) =>
        set((s) => {
          const q = clampQty(productId, quantity);
          return {
            items:
              q <= 0
                ? s.items.filter((i) => !sameLine(i, productId, color))
                : s.items.map((i) => (sameLine(i, productId, color) ? { ...i, quantity: q } : i)),
          };
        }),
      remove: (productId, color) => set((s) => ({ items: s.items.filter((i) => !sameLine(i, productId, color)) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "nexora-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      version: 1,
    },
  ),
);

/** Transforme les lignes du panier en lignes de commande (en ignorant les produits supprimés du catalogue). */
export function toOrderLines(items: CartItem[]): OrderLine[] {
  return items.flatMap((i) => {
    const product = getProductById(i.productId);
    return product ? [{ product, quantity: i.quantity, color: i.color }] : [];
  });
}

export function computeTotals(lines: OrderLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  return { subtotal, shipping, total: subtotal + shipping, count };
}
