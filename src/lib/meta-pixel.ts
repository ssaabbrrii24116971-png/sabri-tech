/**
 * 📈 META PIXEL (Facebook / Instagram Ads)
 * L'identifiant se règle dans le fichier .env.local : NEXT_PUBLIC_META_PIXEL_ID=123456789012345
 * Sans identifiant valide, rien n'est chargé ni envoyé à Meta.
 * En développement, chaque événement est aussi affiché dans la console du navigateur.
 */
import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/types";
import type { OrderLine } from "@/lib/whatsapp";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type StandardEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

const rawId = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();
/** Identifiant validé (chiffres uniquement) : empêche toute injection dans le script ou l'URL. */
export const pixelId = /^\d{6,20}$/.test(rawId) ? rawId : "";

const isDev = process.env.NODE_ENV === "development";
const { currency, rateFromTND } = siteConfig.metaPixel;

/** Convertit un montant TND dans la devise du compte publicitaire (2 décimales). */
const toAdCurrency = (tnd: number) => Math.round(tnd * rateFromTND * 100) / 100;

let initialized = false;

/** Charge le script Meta (une seule fois) et initialise le pixel. */
export function initPixel(): void {
  if (!pixelId || initialized || typeof window === "undefined") return;
  initialized = true;
  // Déjà chargé (ex. module rechargé) : ne pas initialiser le pixel une seconde fois.
  if (window.fbq) return;

  // Équivalent du code officiel : file d'attente utilisée tant que fbevents.js n'est pas chargé.
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  }) as Fbq;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", pixelId);
}

export function track(event: StandardEvent, params: Record<string, unknown> = {}, eventId?: string): void {
  if (typeof window === "undefined") return;
  if (isDev) console.info(`[Meta Pixel]${pixelId ? "" : " (non configuré)"} ${event}`, params, eventId ?? "");
  if (!pixelId || !window.fbq) return;
  if (eventId) window.fbq("track", event, params, { eventID: eventId });
  else window.fbq("track", event, params);
}

const contents = (lines: OrderLine[]) =>
  lines.map((l) => ({ id: l.product.id, quantity: l.quantity, item_price: toAdCurrency(l.product.price) }));

/** Événements e-commerce standard, avec les paramètres attendus par Meta. */
export const pixel = {
  viewContent(product: Product) {
    track("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: toAdCurrency(product.price),
      currency,
    });
  },
  addToCart(product: Product, quantity: number) {
    track("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      contents: [{ id: product.id, quantity, item_price: toAdCurrency(product.price) }],
      value: toAdCurrency(product.price * quantity),
      currency,
    });
  },
  /** value : montant en TND, converti automatiquement. */
  initiateCheckout(lines: OrderLine[], value: number) {
    track("InitiateCheckout", {
      content_ids: lines.map((l) => l.product.id),
      content_type: "product",
      contents: contents(lines),
      num_items: lines.reduce((n, l) => n + l.quantity, 0),
      value: toAdCurrency(value),
      currency,
    });
  },
  /** eventId permet à Meta de dédoublonner si l'événement est un jour aussi envoyé par le serveur (API Conversions). */
  purchase(lines: OrderLine[], value: number, eventId: string) {
    track(
      "Purchase",
      {
        content_ids: lines.map((l) => l.product.id),
        content_type: "product",
        contents: contents(lines),
        num_items: lines.reduce((n, l) => n + l.quantity, 0),
        value: toAdCurrency(value),
        currency,
      },
      eventId,
    );
  },
};
