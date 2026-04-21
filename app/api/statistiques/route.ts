import { NextRequest, NextResponse } from "next/server";
import { extraireContexte } from "@/lib/api-serveur/extraire-jeton";
import { lireConges, lireDocuments, lireEmployes, trouverEmployeParId } from "@/lib/memoire-donnees";
import type { StatistiquesTableauBord } from "@/lib/api/services/service-statistiques";

function construireStats(idsEmployesConcernes: string[] | null): StatistiquesTableauBord {
  const conges = lireConges().filter(
    (c) => !idsEmployesConcernes || idsEmployesConcernes.includes(c.employeId),
  );
  const documents = lireDocuments().filter(
    (d) => !idsEmployesConcernes || idsEmployesConcernes.includes(d.employeId),
  );

  const moisLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
  const seriesMensuelles = moisLabels.map((mois, i) => ({
    mois,
    demandesConges: Math.max(0, Math.round(conges.length * (0.1 + i * 0.04))),
    demandesDocuments: Math.max(0, Math.round(documents.length * (0.08 + i * 0.03))),
    absences: Math.max(0, Math.round((conges.length + documents.length) * 0.05 * (i + 1))),
  }));

  const compteStatuts = (statut: string) => conges.filter((c) => c.statut === statut).length;
  const repartitionStatutsConges = [
    { nom: "Validé", valeur: compteStatuts("valide") || 1 },
    { nom: "En attente", valeur: compteStatuts("en_attente") || 1 },
    { nom: "Refusé", valeur: compteStatuts("refuse") || 0 },
  ];

  const repartitionTypesDocuments = [
    { nom: "Attestations", valeur: documents.filter((d) => d.type === "attestation_salaire").length || 1 },
    { nom: "Certificats", valeur: documents.filter((d) => d.type === "certificat_travail").length || 1 },
    { nom: "Autres", valeur: documents.filter((d) => d.type === "autre" || d.type === "rib").length || 1 },
  ];

  const valides = conges.filter((c) => c.statut === "valide").length;
  const decides = conges.filter((c) => c.statut === "valide" || c.statut === "refuse").length;

  return {
    seriesMensuelles,
    repartitionStatutsConges,
    repartitionTypesDocuments,
    delaiMoyenTraitementJours: decides ? 2.4 + valides * 0.1 : 3,
    tauxValidationConges: decides ? Math.round((valides / decides) * 100) : 72,
    volumeEmployesActifs: idsEmployesConcernes?.length ?? lireEmployes().length,
  };
}

export async function GET(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  if (ctx.role === "employe") {
    return NextResponse.json({ message: "Interdit" }, { status: 403 });
  }
  if (ctx.role === "rh") {
    return NextResponse.json(construireStats(null));
  }
  const manager = trouverEmployeParId(ctx.idEmploye);
  if (!manager) return NextResponse.json(construireStats([]));
  const ids = lireEmployes()
    .filter((e) => e.departement === manager.departement)
    .map((e) => e.id);
  return NextResponse.json(construireStats(ids));
}
