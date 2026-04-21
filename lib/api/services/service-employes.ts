import { apiCliente } from "@/lib/api/cliente-axios";
import type { Employe } from "@/types";

export async function fetchEmployes(): Promise<Employe[]> {
  const { data } = await apiCliente.get<Employe[]>("/employes");
  return data;
}
