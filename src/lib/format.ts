import { siteConfig } from "@/config/site";

/**
 * Formate un prix en dinars tunisiens : 1234.5 → "1 234,500 TND", 79 → "79 TND".
 * Implémentation manuelle (et non Intl) pour un rendu identique serveur / navigateur.
 */
export function formatPrice(amount: number): string {
  const rounded = Math.round(amount * 1000) / 1000;
  const [intPart, decPart] = rounded.toFixed(3).split(".");
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const decimals = decPart === "000" ? "" : `,${decPart}`;
  return `${withSpaces}${decimals} ${siteConfig.currency}`;
}

export function shippingFor(subtotal: number): number {
  const { fee, freeFrom } = siteConfig.shipping;
  if (subtotal <= 0) return 0;
  if (freeFrom > 0 && subtotal >= freeFrom) return 0;
  return fee;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
