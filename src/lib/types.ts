export type CategorySlug =
  | "montres-connectees"
  | "ecouteurs"
  | "chargeurs"
  | "cables-adaptateurs"
  | "enceintes-audio"
  | "supports-accessoires";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
};

export type ProductTag = "bestseller" | "new" | "promo";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Prix de vente en TND */
  price: number;
  /** Ancien prix barré en TND (optionnel) */
  oldPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors?: string[];
  compatibility?: string[];
  tags: ProductTag[];
  /** Date d'ajout (YYYY-MM-DD), utilisée pour le tri « Nouveautés » */
  addedAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  color?: string;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
};
