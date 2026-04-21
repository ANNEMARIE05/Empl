import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployes,
  creerEmploye,
  modifierEmploye,
  supprimerEmploye,
} from "@/lib/api/services/service-employes";
import { clesRequetes } from "@/hooks/queries/cles-requetes";
import type { Employe } from "@/types";

export function useEmployes() {
  return useQuery({
    queryKey: clesRequetes.employes,
    queryFn: fetchEmployes,
  });
}

export function useCreerEmploye() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employe: Omit<Employe, "id">) => creerEmploye(employe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clesRequetes.employes });
    },
  });
}

export function useModifierEmploye() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<Employe> & { id: string }) =>
      modifierEmploye(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clesRequetes.employes });
    },
  });
}

export function useSupprimerEmploye() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supprimerEmploye(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clesRequetes.employes });
    },
  });
}
