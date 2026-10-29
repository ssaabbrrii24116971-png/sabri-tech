import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { t } from "@/i18n";

export const metadata: Metadata = { title: t.catalog.title };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-slate-400">…</div>}>
      <CatalogClient />
    </Suspense>
  );
}
