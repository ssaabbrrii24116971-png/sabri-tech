"use client";

import { useEffect, useState } from "react";

/** Retourne true une fois le composant monté côté navigateur (évite les écarts d'hydratation avec le panier stocké en localStorage). */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
