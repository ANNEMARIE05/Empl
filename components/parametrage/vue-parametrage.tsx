"use client";

import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";

export function VueParametrage() {
  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Paramétrage métier</CarteTitre>
        <CarteDescription>
          Espace réservé au rôle RH : règles de validation, types de documents, modèles d’export (démonstration sans
          persistance serveur).
        </CarteDescription>
      </CarteEntete>
      <CarteContenu className="text-sm text-[var(--texte-secondaire)]">
        Branchez ici vos futurs écrans d’administration (API réelle, rôles granulaires, journaux d’audit).
      </CarteContenu>
    </Carte>
  );
}
