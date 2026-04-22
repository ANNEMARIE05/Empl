import type { RoleUtilisateur } from "@/types";

/** Bannières hero (Unsplash) — visuels distincts RH / employé. */
export const banniereDashboardRh =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80";

export const banniereDashboardEmploye =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";

export function urlBanniereTableauBord(role: RoleUtilisateur): string {
  if (role === "rh") return banniereDashboardRh;
  return banniereDashboardEmploye;
}
