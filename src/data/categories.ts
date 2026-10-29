import type { Category } from "@/lib/types";

/** Catégories de la boutique. Les images se trouvent dans /public/images/categories. */
export const categories: Category[] = [
  {
    slug: "montres-connectees",
    name: "Montres connectées",
    description: "Sport, santé et notifications au poignet",
    image: "/images/categories/montres-connectees.svg",
  },
  {
    slug: "ecouteurs",
    name: "Écouteurs",
    description: "Bluetooth, sans fil et filaires",
    image: "/images/categories/ecouteurs.svg",
  },
  {
    slug: "chargeurs",
    name: "Chargeurs rapides",
    description: "USB-C, Lightning, charge rapide PD",
    image: "/images/categories/chargeurs.svg",
  },
  {
    slug: "cables-adaptateurs",
    name: "Câbles & adaptateurs",
    description: "USB-C, Lightning, hubs et adaptateurs",
    image: "/images/categories/cables-adaptateurs.svg",
  },
  {
    slug: "enceintes-audio",
    name: "Enceintes & audio",
    description: "Enceintes Bluetooth et accessoires audio",
    image: "/images/categories/enceintes-audio.svg",
  },
  {
    slug: "supports-accessoires",
    name: "Supports & accessoires",
    description: "Supports voiture, trépieds, power banks",
    image: "/images/categories/supports-accessoires.svg",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
