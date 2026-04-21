import type { StatutDemandeConge, TypeConge } from "@/types";

export function libelleTypeConge(t: TypeConge) {
  const map: Record<TypeConge, string> = {
    annuel: "Congé annuel",
    sans_solde: "Sans solde",
    maladie: "Maladie",
    maternite: "Maternité / paternité",
    autre: "Autre",
  };
  return map[t];
}

export function libelleStatutConge(s: StatutDemandeConge) {
  const map: Record<StatutDemandeConge, string> = {
    brouillon: "Brouillon",
    en_attente: "En attente",
    valide: "Validé",
    refuse: "Refusé",
    annule: "Annulé",
  };
  return map[s];
}
