import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDocuments,
  patchDocument,
  postDemandeDocument,
} from "@/lib/api/services/service-documents";
import { clesRequetes } from "@/hooks/queries/cles-requetes";
import type { StatutDemandeDocument, TypeDocument } from "@/types";

export function useDocuments() {
  return useQuery({
    queryKey: clesRequetes.documents,
    queryFn: fetchDocuments,
  });
}

export function useMiseAJourDocumentRh() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      id: string;
      commentaireRh?: string;
      statut?: StatutDemandeDocument;
    }) => patchDocument(args.id, args),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: clesRequetes.documents });
    },
  });
}

export function useCreationDemandeDocument() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (args: { type: TypeDocument; commentaireEmploye?: string }) =>
      postDemandeDocument(args),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: clesRequetes.documents });
    },
  });
}
