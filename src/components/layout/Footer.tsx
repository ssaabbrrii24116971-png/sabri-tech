import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { t } from "@/i18n";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-slate-400">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo dark />
          <p className="text-sm leading-relaxed">{t.footer.about}</p>
          <div className="flex gap-2">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-brand-500 hover:text-white">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-brand-500 hover:text-white">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-whatsapp hover:text-white">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.shop}</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produits?categorie=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.help}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/livraison" className="hover:text-white">{t.footer.deliveryReturns}</Link></li>
            <li><Link href="/livraison#commander" className="hover:text-white">{t.footer.howToOrder}</Link></li>
            <li><Link href="/produits?tag=promo" className="hover:text-white">{t.nav.deals}</Link></li>
            <li><Link href="/panier" className="hover:text-white">{t.cart.title}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.contact}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-brand-400" /><span dir="ltr">{siteConfig.phoneDisplay}</span></li>
            <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-brand-400" /><a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a></li>
            <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-brand-400" />{siteConfig.city}</li>
            <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-brand-400" />{siteConfig.openingHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {year} {siteConfig.name}. {t.footer.rights}</p>
          {siteConfig.demoMode && <p className="text-amber-300/80">{t.footer.demoNote}</p>}
        </div>
      </div>
    </footer>
  );
}
