import { siteConfig } from "@/config/site";
import { ar } from "./ar";
import { fr, type Dictionary } from "./fr";

const dictionaries: Record<"fr" | "ar", Dictionary> = { fr, ar };

/** Dictionnaire de la langue configurée (utilisable côté serveur et navigateur). */
export const t: Dictionary = dictionaries[siteConfig.locale] ?? fr;
export const dir: "ltr" | "rtl" = siteConfig.locale === "ar" ? "rtl" : "ltr";

/** Remplace les {clés} d'un texte : fmt("Plus que {n}", { n: 3 }) → "Plus que 3". */
export function fmt(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}
