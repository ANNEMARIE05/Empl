import { useQuery } from "@tanstack/react-query";
import { fetchStatistiques } from "@/lib/api/services/service-statistiques";
import { clesRequetes } from "@/hooks/queries/cles-requetes";

export function useStatistiques(active: boolean) {
  return useQuery({
    queryKey: clesRequetes.statistiques,
    queryFn: fetchStatistiques,
    enabled: active,
  });
}
