"use client";

import { usePathname } from "next/navigation";
import { t } from "@/i18n";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppFloat() {
  // La page de commande a déjà son propre bouton WhatsApp ; l'admin n'en a pas besoin.
  const pathname = usePathname();
  if (pathname === "/panier" || pathname.startsWith("/admin")) return null;
  return (
    <a
      href={buildWhatsAppLink(t.whatsapp.floatMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.float}
      className="group fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,.7)] transition hover:scale-105 sm:pe-5"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-whatsapp animate-pulse-ring" aria-hidden />
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-semibold sm:inline">{t.whatsapp.float}</span>
    </a>
  );
}
