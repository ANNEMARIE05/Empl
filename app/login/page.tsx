"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageConnexion } from "@/components/auth/page-connexion";
import { ChargeurPleinEcran } from "@/components/layout/chargeur-plein-ecran";
import { useZustandHydratationPret } from "@/hooks/use-zustand-hydratation";
import { magasinApplication } from "@/stores/magasin-application";

export default function ConnexionRoute() {
  const router = useRouter();
  const zustandPret = useZustandHydratationPret();
  const estAuthentifie = magasinApplication((s) => s.estAuthentifie);

  useEffect(() => {
    if (!zustandPret || !estAuthentifie) return;
    router.replace("/?page=tableau-bord");
  }, [zustandPret, estAuthentifie, router]);

  if (!zustandPret) {
    return <ChargeurPleinEcran texte="MUFER Employés" />;
  }

  if (estAuthentifie) {
    return <ChargeurPleinEcran texte="MUFER Employés" />;
  }

  return <PageConnexion />;
}
