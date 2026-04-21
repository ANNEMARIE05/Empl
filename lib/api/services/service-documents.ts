import { apiCliente } from "@/lib/api/cliente-axios";
import type { DemandeDocument, StatutDemandeDocument, TypeDocument } from "@/types";

export async function fetchDocuments(): Promise<DemandeDocument[]> {
  const { data } = await apiCliente.get<DemandeDocument[]>("/documents");
  return data;
}

export async function patchDocument(
  id: string,
  corps: { commentaireRh?: string; statut?: StatutDemandeDocument },
): Promise<DemandeDocument> {
  const { data } = await apiCliente.patch<DemandeDocument>("/documents", {
    id,
    ...corps,
  });
  return data;
}

export async function postDemandeDocument(corps: {
  type: TypeDocument;
  commentaireEmploye?: string;
}): Promise<DemandeDocument> {
  const { data } = await apiCliente.post<DemandeDocument>("/documents", corps);
  return data;
}
