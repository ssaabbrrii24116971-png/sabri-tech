/**
 * Couche d'accès aux données du catalogue.
 * Aujourd'hui les produits viennent du fichier src/data/products.ts.
 * Pour brancher une base de données plus tard, il suffit de remplacer
 * l'implémentation de ces fonctions (voir README, section « Base de données »).
 */
import { products } from "@/data/products";
import type { Product, ProductTag } from "@/lib/types";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByTag(tag: ProductTag, limit = 8): Product[] {
  const list = products.filter((p) => p.tags.includes(tag));
  if (tag === "new") list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  if (tag === "bestseller") list.sort((a, b) => b.reviewsCount - a.reviewsCount);
  return list.slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export function getBrands(): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getPriceBounds(): { min: number; max: number } {
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Normalise une chaîne pour la recherche (minuscules, sans accents). */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function searchProducts(query: string, list: Product[] = products): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return list;
  return list.filter((p) => {
    const haystack = normalize(
      [p.name, p.brand, p.shortDescription, p.category, ...(p.compatibility ?? []), ...p.features].join(" "),
    );
    return terms.every((t) => haystack.includes(t));
  });
}

export function discountPercent(p: Product): number {
  if (!p.oldPrice || p.oldPrice <= p.price) return 0;
  return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
}
