import Link from "next/link";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-500">404</p>
      <h1 className="section-title">{t.notFound.title}</h1>
      <p className="text-slate-500">{t.notFound.text}</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">{t.notFound.back}</Link>
        <Link href="/produits" className="btn-outline">{t.product.backToShop}</Link>
      </div>
    </div>
  );
}
