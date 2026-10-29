/**
 * ⚙️ CONFIGURATION DE LA BOUTIQUE
 * Tous les réglages de la boutique sont ici : nom, logo, contact,
 * numéro WhatsApp, frais de livraison, langue.
 */
function siteUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (custom) return (/^https?:\/\//.test(custom) ? custom : `https://${custom}`).replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "SABRI TECH",
  /** Affiché dans le logo : première partie en blanc/noir, seconde en bleu. */
  logoText: ["SABRI", "TECH"] as const,
  /**
   * Adresse publique du site (aperçus de partage Facebook / WhatsApp).
   * Ordre : NEXT_PUBLIC_SITE_URL (votre domaine) → domaine de production Vercel (automatique) → localhost.
   */
  url: siteUrl(),
  tagline: "Accessoires électroniques premium en Tunisie",
  description:
    "Montres connectées, écouteurs, chargeurs rapides, câbles, enceintes et accessoires. Livraison partout en Tunisie, paiement à la livraison.",
  /**
   * Logo image optionnel (ex : "/logo.png" placé dans /public).
   * Laisser vide ("") pour utiliser le logo éclair intégré.
   */
  logoImage: "",

  /**
   * Numéro WhatsApp au format international : chiffres uniquement, sans "+", espaces ni tirets.
   * ⚠️ PLACEHOLDER — remplacez-le par votre numéro, par ex. "21698123456".
   */
  whatsappNumber: "21652735627",
  phoneDisplay: "+216 52 735 627",
  email: "contact@exemple.tn",
  city: "Tunis, Tunisie",
  openingHours: "Lun – Sam : 9h – 19h",

  currency: "TND",

  /**
   * Meta Pixel : Meta n'accepte pas le dinar tunisien (TND) comme devise.
   * Les montants envoyés à Meta sont donc convertis dans la devise de votre compte publicitaire.
   * ⚠️ Mettez à jour le taux de temps en temps (1 TND = combien dans cette devise).
   */
  metaPixel: {
    currency: "USD",
    rateFromTND: 0.33,
  },

  shipping: {
    /** Frais de livraison en TND */
    fee: 8,
    /** Livraison gratuite à partir de ce montant (TND). Mettre 0 pour désactiver. */
    freeFrom: 150,
    delay: "24–72h",
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },

  /** Langue de l'interface : "fr" ou "ar" (arabe, affichage de droite à gauche). */
  locale: "fr" as "fr" | "ar",

  /** Affiche un bandeau indiquant que les produits, prix et avis sont fictifs. */
  demoMode: true,
};

export const cities = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte",
  "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia",
  "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gabès", "Médenine",
  "Tataouine", "Gafsa", "Tozeur", "Kébili",
] as const;
