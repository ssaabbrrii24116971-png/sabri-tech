import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/format";

/** Logo de la boutique : image configurée dans site.ts, ou symbole éclair + nom. */
export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  const [first, second] = siteConfig.logoText;
  return (
    <Link href="/" aria-label={`${siteConfig.name} – accueil`} className={cn("flex shrink-0 items-center gap-2", className)}>
      {siteConfig.logoImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={siteConfig.logoImage} alt={siteConfig.name} className="h-9 w-auto" />
      ) : (
        <>
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path d="M13.5 2 5 13.5h6L9.5 22 19 9.5h-6.2L13.5 2Z" fill="#fff" />
            </svg>
          </span>
          <span className={cn("font-display text-lg font-extrabold tracking-tight", dark ? "text-white" : "text-ink")}>
            {first}
            <span className="text-brand-500"> {second}</span>
          </span>
        </>
      )}
    </Link>
  );
}
