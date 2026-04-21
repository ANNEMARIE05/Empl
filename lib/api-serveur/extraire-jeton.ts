import type { NextRequest } from "next/server";
import type { RoleUtilisateur } from "@/types";
import { decoderJetonCoteServeur } from "@/lib/jeton-mock-serveur";

export interface ContexteAuthentification {
  idEmploye: string;
  role: RoleUtilisateur;
}

export function extraireContexte(req: NextRequest): ContexteAuthentification | null {
  const auth = req.headers.get("authorization");
  return decoderJetonCoteServeur(auth);
}
