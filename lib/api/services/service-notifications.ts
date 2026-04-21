import { apiCliente } from "@/lib/api/cliente-axios";
import type { NotificationItem } from "@/types";

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const { data } = await apiCliente.get<NotificationItem[]>("/notifications");
  return data;
}

export async function patchNotificationLue(id: string): Promise<void> {
  await apiCliente.patch("/notifications", { id });
}
