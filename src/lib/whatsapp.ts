import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import type { CustomerInfo, Product } from "@/lib/types";

export type OrderLine = { product: Product; quantity: number; color?: string };

/** Nettoie le numéro configuré : ne garde que les chiffres. */
function waNumber(): string {
  return siteConfig.whatsappNumber.replace(/\D/g, "");
}

/** Construit un lien wa.me avec un message correctement encodé. */
export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${waNumber()}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** true tant que le numéro WhatsApp est le placeholder par défaut. */
export function isPlaceholderNumber(): boolean {
  return /^2160+$/.test(waNumber()) || waNumber().length < 8;
}

/** Retire les caractères de contrôle et limite la longueur d'un champ saisi par le client. */
export function sanitize(value: string, max = 200): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function buildOrderMessage(
  lines: OrderLine[],
  totals: { subtotal: number; shipping: number; total: number },
  customer: CustomerInfo,
): string {
  const items = lines
    .map((l, i) => {
      const variant = l.color ? ` (${l.color})` : "";
      return `${i + 1}. ${l.product.name}${variant}\n   Qté : ${l.quantity} × ${formatPrice(l.product.price)} = ${formatPrice(
        l.product.price * l.quantity,
      )}`;
    })
    .join("\n");

  const note = customer.note ? `\nRemarque : ${sanitize(customer.note, 300)}` : "";

  return [
    `Bonjour ${siteConfig.name}, je souhaite passer une commande :`,
    "",
    "*Produits*",
    items,
    "",
    `Sous-total : ${formatPrice(totals.subtotal)}`,
    `Livraison : ${totals.shipping === 0 ? "Gratuite" : formatPrice(totals.shipping)}`,
    `*Total : ${formatPrice(totals.total)}*`,
    "",
    "*Mes coordonnées*",
    `Nom : ${sanitize(customer.name, 80)}`,
    `Téléphone : ${sanitize(customer.phone, 20)}`,
    `Ville : ${sanitize(customer.city, 40)}`,
    `Adresse : ${sanitize(customer.address, 200)}${note}`,
    "",
    "Paiement à la livraison. Merci de me confirmer la commande.",
  ].join("\n");
}

export function buildProductQuestion(product: Product): string {
  return `Bonjour ${siteConfig.name}, je suis intéressé(e) par « ${product.name} » (${formatPrice(
    product.price,
  )}). Est-il disponible ?`;
}

/** Valide un numéro tunisien : 8 chiffres (2, 3, 4, 5, 7 ou 9 en tête), avec ou sans +216 / 00216. */
export function isValidTunisianPhone(phone: string): boolean {
  const digits = phone.replace(/[\s.\-()]/g, "");
  return /^(?:\+216|00216|216)?[234579]\d{7}$/.test(digits);
}
