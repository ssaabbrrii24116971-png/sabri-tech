"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initPixel, pixel, track } from "@/lib/meta-pixel";
import type { Product } from "@/lib/types";

/** Initialise le pixel et envoie un PageView à chaque changement de page (hors /admin). */
export function MetaPixel() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    initPixel();
    track("PageView");
  }, [pathname]);
  return null;
}

/** À placer sur une fiche produit : envoie ViewContent une fois par produit affiché. */
export function TrackViewContent({ product }: { product: Product }) {
  useEffect(() => {
    pixel.viewContent(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  return null;
}
