import { create } from "zustand";
import { persist } from "zustand/middleware";
import { connecterApi } from "@/lib/api/services/service-auth";
import type { Employe, IdOnglet } from "@/types";

export const identifiantsOnglets: IdOnglet[] = [
  "tableau-bord",
  "mon-profil",
  "mes-conges",
  "absences",
  "mes-documents",
  "employes",
  "conges",
  "documents",
  "statistiques",
  "notifications",
  "historique",
  "parametrage",
  "parametres",
];

function estOngletValide(id: string): id is IdOnglet {
  return identifiantsOnglets.includes(id as IdOnglet);
}

export interface MagasinApplication {
  utilisateurConnecte: Employe | null;
  jetonMock: string | null;
  estAuthentifie: boolean;
  menuOuvert: boolean;
  ongletActif: IdOnglet;
  connecter: (email: string, motDePasse: string) => Promise<void>;
  deconnecter: () => void;
  definirOngletActif: (id: IdOnglet) => void;
  resoudreOngletDepuisChaine: (page: string | null) => void;
  basculerMenu: () => void;
  definirMenuOuvert: (ouvert: boolean) => void;
}

export const magasinApplication = create<MagasinApplication>()(
  persist(
    (set, get) => ({
      utilisateurConnecte: null,
      jetonMock: null,
      estAuthentifie: false,
      menuOuvert: true,
      ongletActif: "tableau-bord",
      connecter: async (email, motDePasse) => {
        const { employe, jeton } = await connecterApi(email, motDePasse);
        set({
          utilisateurConnecte: employe,
          jetonMock: jeton,
          estAuthentifie: true,
          ongletActif: "tableau-bord",
        });
      },
      deconnecter: () =>
        set({
          utilisateurConnecte: null,
          jetonMock: null,
          estAuthentifie: false,
          ongletActif: "tableau-bord",
        }),
      definirOngletActif: (id) => set({ ongletActif: id }),
      resoudreOngletDepuisChaine: (page) => {
        if (page === "formulaire-conge") {
          set({ ongletActif: "mes-conges" });
          return;
        }
        if (page === "formulaire-document") {
          set({ ongletActif: "mes-documents" });
          return;
        }
        if (page === "formulaire-absence") {
          set({ ongletActif: "absences" });
          return;
        }
        if (page && estOngletValide(page)) {
          set({ ongletActif: page });
          return;
        }
        set({ ongletActif: "tableau-bord" });
      },
      basculerMenu: () => set({ menuOuvert: !get().menuOuvert }),
      definirMenuOuvert: (ouvert) => set({ menuOuvert: ouvert }),
    }),
    {
      name: "mufer-employes-stockage",
      partialize: (etat) => ({
        utilisateurConnecte: etat.utilisateurConnecte,
        jetonMock: etat.jetonMock,
        estAuthentifie: etat.estAuthentifie,
        menuOuvert: etat.menuOuvert,
        ongletActif: etat.ongletActif,
      }),
      skipHydration: true,
    },
  ),
);
