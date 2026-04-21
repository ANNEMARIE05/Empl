import axios from "axios";
import type { Employe } from "@/types";

export interface ReponseConnexion {
  employe: Employe;
  jeton: string;
}

export async function connecterApi(
  email: string,
  motDePasse: string,
): Promise<ReponseConnexion> {
  const { data } = await axios.post<ReponseConnexion>("/api/auth/connexion", {
    email,
    motDePasse,
  });
  return data;
}
