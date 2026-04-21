import { apiCliente } from "@/lib/api/cliente-axios";

export interface SerieMensuelle {
  mois: string;
  demandesConges: number;
  demandesDocuments: number;
  absences: number;
}

export interface StatistiquesTableauBord {
  seriesMensuelles: SerieMensuelle[];
  repartitionStatutsConges: { nom: string; valeur: number }[];
  repartitionTypesDocuments: { nom: string; valeur: number }[];
  delaiMoyenTraitementJours: number;
  tauxValidationConges: number;
  volumeEmployesActifs: number;
}

export async function fetchStatistiques(): Promise<StatistiquesTableauBord> {
  const { data } = await apiCliente.get<StatistiquesTableauBord>("/statistiques");
  return data;
}
