import type { RoleUtilisateur } from "@/types";

export interface ChargeUtileJeton {
  idEmploye: string;
  role: RoleUtilisateur;
}

/** Encodage côté client (tests locaux) — la connexion utilise le jeton renvoyé par l’API. */
export function encoderJetonCoteClient(payload: ChargeUtileJeton): string {
  const json = JSON.stringify(payload);
  return `mock.${btoa(unescape(encodeURIComponent(json)))}`;
}
