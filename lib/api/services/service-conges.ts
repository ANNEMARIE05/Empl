import { apiCliente } from "@/lib/api/cliente-axios";
import type { DemandeConge, StatutDemandeConge, TypeConge } from "@/types";

export async function fetchConges(): Promise<DemandeConge[]> {
  const { data } = await apiCliente.get<DemandeConge[]>("/conges");
  return data;
}

export async function patchConge(
  id: string,
  corps: {
    commentaireRh?: string;
    statut?: StatutDemandeConge;
  },
): Promise<DemandeConge> {
  const { data } = await apiCliente.patch<DemandeConge>("/conges", {
    id,
    ...corps,
  });
  return data;
}

export async function postDemandeConge(corps: {
  type: TypeConge;
  dateDebut: string;
  dateFin: string;
  motif?: string;
}): Promise<DemandeConge> {
  const { data } = await apiCliente.post<DemandeConge>("/conges", corps);
  return data;
}
