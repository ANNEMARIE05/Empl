"use client";

import { useEffect, useState } from "react";
import { magasinApplication } from "@/stores/magasin-application";

export function useZustandHydratationPret() {
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const p = magasinApplication.persist;
    if (!p) {
      setPret(true);
      return;
    }
    if (p.hasHydrated()) {
      setPret(true);
      return;
    }
    const off = p.onFinishHydration(() => setPret(true));
    void p.rehydrate();
    return off;
  }, []);

  return pret;
}
