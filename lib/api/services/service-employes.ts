import { apiCliente } from "@/lib/api/cliente-axios";
import type { Employe } from "@/types";

export async function fetchEmployes(): Promise<Employe[]> {
  const { data } = await apiCliente.get<Employe[]>("/employes");
  return data;
}

export async function creerEmploye(employe: Omit<Employe, "id">): Promise<Employe> {
  const { data } = await apiCliente.post<Employe>("/employes", employe);
  return data;
}

export async function modifierEmploye(id: string, patch: Partial<Omit<Employe, "id">>): Promise<Employe> {
  const { data } = await apiCliente.put<Employe>("/employes", { id, ...patch });
  return data;
}

export async function supprimerEmploye(id: string): Promise<void> {
  await apiCliente.delete(`/employes?id=${id}`);
}
