import { Hero } from "@/components/home/Hero";
import { CategoryGrid, ProductSection, PromoBand, Reviews, ServiceInfo } from "@/components/home/Sections";
import { t } from "@/i18n";
import { getProductsByTag } from "@/lib/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceInfo />
      <CategoryGrid />
      <ProductSection
        title={t.sections.bestsellers}
        subtitle={t.sections.bestsellersSub}
        href="/produits?tri=populaires"
        items={getProductsByTag("bestseller", 8)}
        muted
      />
      <ProductSection
        title={t.sections.newArrivals}
        subtitle={t.sections.newArrivalsSub}
        href="/produits?tri=nouveautes"
        items={getProductsByTag("new", 4)}
      />
      <PromoBand />
      <ProductSection
        title={t.sections.deals}
        subtitle={t.sections.dealsSub}
        href="/produits?tag=promo"
        items={getProductsByTag("promo", 4)}
      />
      <Reviews />
    </>
  );
}
