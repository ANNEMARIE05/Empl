import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  patchNotificationLue,
} from "@/lib/api/services/service-notifications";
import { clesRequetes } from "@/hooks/queries/cles-requetes";

export function useNotifications() {
  return useQuery({
    queryKey: clesRequetes.notifications,
    queryFn: fetchNotifications,
  });
}

export function useMarquerNotificationLue() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchNotificationLue(id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: clesRequetes.notifications });
    },
  });
}
