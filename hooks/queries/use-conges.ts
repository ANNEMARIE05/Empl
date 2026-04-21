import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchConges, patchConge, postDemandeConge } from "@/lib/api/services/service-conges";
import { clesRequetes } from "@/hooks/queries/cles-requetes";
import type { StatutDemandeConge, TypeConge } from "@/types";

export function useConges() {
  return useQuery({
    queryKey: clesRequetes.conges,
    queryFn: fetchConges,
  });
}

export function useMiseAJourCongeRh() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      id: string;
      commentaireRh?: string;
      noteInterneRh?: string;
      statut?: StatutDemandeConge;
    }) => patchConge(args.id, args),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: clesRequetes.conges });
    },
  });
}

export function useCreationDemandeConge() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      type: TypeConge;
      dateDebut: string;
      dateFin: string;
      motif?: string;
    }) => postDemandeConge(args),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: clesRequetes.conges });
    },
  });
}
