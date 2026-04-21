import { useQuery } from "@tanstack/react-query";
import { fetchEmployes } from "@/lib/api/services/service-employes";
import { clesRequetes } from "@/hooks/queries/cles-requetes";

export function useEmployes() {
  return useQuery({
    queryKey: clesRequetes.employes,
    queryFn: fetchEmployes,
  });
}
