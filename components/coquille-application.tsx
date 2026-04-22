"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageAbsences } from "@/components/absences/page-absences";
import { FondApplicationDecor } from "@/components/deco/fond-application";
import { TableauBordEmploye } from "@/components/dashboard/tableau-bord-employe";
import { TableauBordRh } from "@/components/dashboard/tableau-bord-rh";
import { PageDocumentsRh } from "@/components/documents/page-documents-rh";
import { VueMesDocuments } from "@/components/documents/vue-mes-documents";
import { ListeEmployes } from "@/components/employes/liste-employes";
import { PageHistorique } from "@/components/historique/page-historique";
import { ChargeurPleinEcran } from "@/components/layout/chargeur-plein-ecran";
import { BarreLaterale } from "@/components/layout/barre-laterale";
import { EnteteApplication } from "@/components/layout/entete-application";
import { VueNotifications } from "@/components/notifications/vue-notifications";
import { PageGestionCongesRh } from "@/components/conges/page-gestion-conges-rh";
import { VueMesConges } from "@/components/conges/vue-mes-conges";
import { VueParametrage } from "@/components/parametrage/vue-parametrage";
import { VueParametres } from "@/components/parametres/vue-parametres";
import { VueMonProfil } from "@/components/profil/vue-mon-profil";
import { PanneauStatistiques } from "@/components/statistiques/panneau-statistiques";
import { useDefilementHaut } from "@/hooks/use-defilement-haut";
import { useMediaRequete } from "@/hooks/use-media-requete";
import { useZustandHydratationPret } from "@/hooks/use-zustand-hydratation";
import { magasinApplication } from "@/stores/magasin-application";
import type { IdOnglet } from "@/types";

function renduContenu({
  onglet,
  role,
  impulsionConge,
  impulsionDocument,
  impulsionAbsence,
}: {
  onglet: IdOnglet;
  role: "rh" | "manager" | "employe";
  impulsionConge: number;
  impulsionDocument: number;
  impulsionAbsence: number;
}) {
  switch (onglet) {
    case "tableau-bord":
      return role === "rh" ? <TableauBordRh /> : <TableauBordEmploye />;
    case "mon-profil":
      return <VueMonProfil />;
    case "mes-conges":
      return <VueMesConges impulsionFormulaire={impulsionConge} />;
    case "absences":
      return <PageAbsences impulsionFormulaire={impulsionAbsence} />;
    case "mes-documents":
      return <VueMesDocuments impulsionFormulaire={impulsionDocument} />;
    case "employes":
      return role === "employe" ? <TableauBordEmploye /> : <ListeEmployes />;
    case "conges":
      return role === "rh" ? <PageGestionCongesRh /> : <VueMesConges impulsionFormulaire={impulsionConge} />;
    case "documents":
      return role === "rh" ? <PageDocumentsRh /> : <VueMesDocuments impulsionFormulaire={impulsionDocument} />;
    case "statistiques":
      return role === "employe" ? <TableauBordEmploye /> : <PanneauStatistiques />;
    case "notifications":
      return <VueNotifications />;
    case "historique":
      return <PageHistorique />;
    case "parametrage":
      return role === "rh" ? <VueParametrage /> : <TableauBordEmploye />;
    case "parametres":
      return <VueParametres />;
    default:
      return <TableauBordEmploye />;
  }
}

export function CoquilleApplication() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const estAuthentifie = magasinApplication((s) => s.estAuthentifie);
  const ongletActif = magasinApplication((s) => s.ongletActif);
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const menuOuvert = magasinApplication((s) => s.menuOuvert);
  const definirOngletActif = magasinApplication((s) => s.definirOngletActif);
  const resoudreOngletDepuisChaine = magasinApplication((s) => s.resoudreOngletDepuisChaine);

  const zustandPret = useZustandHydratationPret();
  const [introPret, setIntroPret] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [impulsionConge, setImpulsionConge] = useState(0);
  const [impulsionDocument, setImpulsionDocument] = useState(0);
  const [impulsionAbsence, setImpulsionAbsence] = useState(0);
  const estLarge = useMediaRequete("(min-width: 1024px)");

  useEffect(() => {
    if (!zustandPret) return;
    if (!estAuthentifie) {
      router.replace("/login");
    }
  }, [zustandPret, estAuthentifie, router]);

  useEffect(() => {
    if (!zustandPret) return;
    const id = window.setTimeout(() => setIntroPret(true), 800);
    return () => window.clearTimeout(id);
  }, [zustandPret]);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page === "formulaire-conge") {
      definirOngletActif("mes-conges");
      window.setTimeout(() => setImpulsionConge((c) => c + 1), 0);
      router.replace("/?page=mes-conges");
      return;
    }
    if (page === "formulaire-document") {
      definirOngletActif("mes-documents");
      window.setTimeout(() => setImpulsionDocument((c) => c + 1), 0);
      router.replace("/?page=mes-documents");
      return;
    }
    if (page === "formulaire-absence") {
      definirOngletActif("absences");
      window.setTimeout(() => setImpulsionAbsence((c) => c + 1), 0);
      router.replace("/?page=absences");
      return;
    }
    resoudreOngletDepuisChaine(page);
  }, [searchParams, router, definirOngletActif, resoudreOngletDepuisChaine]);

  useDefilementHaut(ongletActif);

  const margeGauche = estLarge ? (menuOuvert ? 260 : 72) : 0;

  if (!zustandPret) {
    return <ChargeurPleinEcran />;
  }

  if (!introPret) {
    return <ChargeurPleinEcran texte="MUFER Employés" />;
  }

  if (!estAuthentifie) {
    return <ChargeurPleinEcran texte="MUFER Employés" />;
  }

  if (!utilisateur) {
    return <ChargeurPleinEcran texte="Session…" />;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-racine)] text-[var(--texte-principal)]">
      <FondApplicationDecor />
      <BarreLaterale mobileOuverte={menuMobile} surFermerMobile={() => setMenuMobile(false)} />
      <EnteteApplication
        margeGauche={margeGauche}
        surMenuMobile={() => setMenuMobile(true)}
      />
      <motion.main
        layout
        className="min-h-screen px-2.5 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20"
        style={{ marginLeft: margeGauche }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={ongletActif}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {renduContenu({
              onglet: ongletActif,
              role: utilisateur.role,
              impulsionConge,
              impulsionDocument,
              impulsionAbsence,
            })}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
