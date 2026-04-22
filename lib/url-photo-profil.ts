import type { RoleUtilisateur } from "@/types";

/** Portraits libres de droits (Unsplash, Pexels) — remplacements si aucune photo en base. */
const photosProfilParDefaut: Record<RoleUtilisateur, string> = {
  rh: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  manager:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  employe:
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
};

export function urlPhotoProfil(photoUrl: string | undefined, role: RoleUtilisateur): string {
  const t = photoUrl?.trim();
  if (t) return t;
  return photosProfilParDefaut[role] ?? photosProfilParDefaut.employe;
}
