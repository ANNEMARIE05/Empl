import type { StatutDemandeDocument, TypeDocument } from "@/types";

export function libelleTypeDocument(t: TypeDocument) {
  const map: Record<TypeDocument, string> = {
    attestation_salaire: "Attestation de salaire",
    certificat_travail: "Certificat de travail",
    rib: "RIB / coordonnées bancaires",
    fiche_paie: "Fiche de paie",
    convention_stage: "Convention de stage",
    autre: "Autre document",
  };
  return map[t];
}

export function libelleStatutDocument(s: StatutDemandeDocument) {
  const map: Record<StatutDemandeDocument, string> = {
    en_attente: "En attente",
    en_traitement: "En traitement",
    pret: "Validés",
    refuse: "Refusé",
  };
  return map[s];
}
