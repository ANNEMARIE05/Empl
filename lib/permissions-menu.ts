import type { IdOnglet, RoleUtilisateur } from "@/types";

export interface ElementMenu {
  id: IdOnglet;
  libelle: string;
  roles: RoleUtilisateur[];
}

export const elementsMenuPrincipal: ElementMenu[] = [
  { id: "tableau-bord", libelle: "Tableau de bord", roles: ["rh", "manager", "employe"] },
  { id: "mon-profil", libelle: "Mon profil", roles: ["employe", "manager"] },
  { id: "mes-conges", libelle: "Mes congés", roles: ["employe", "manager"] },
  { id: "absences", libelle: "Absences", roles: ["rh", "manager", "employe"] },
  { id: "mes-documents", libelle: "Mes documents", roles: ["employe", "manager"] },
  { id: "employes", libelle: "Employés", roles: ["rh", "manager"] },
  { id: "conges", libelle: "Gestion congés", roles: ["rh"] },
  { id: "documents", libelle: "Gestion documents", roles: ["rh"] },
  { id: "statistiques", libelle: "Statistiques", roles: ["rh", "manager"] },
  { id: "notifications", libelle: "Notifications", roles: ["rh", "manager", "employe"] },
  { id: "historique", libelle: "Historique", roles: ["rh", "manager", "employe"] },
];

export const elementsMenuSecondaire: ElementMenu[] = [
  { id: "parametrage", libelle: "Paramétrage", roles: ["rh"] },
  { id: "parametres", libelle: "Paramètres", roles: ["rh", "manager", "employe"] },
];

export function filtrerMenuParRole<T extends { roles: RoleUtilisateur[] }>(
  elements: T[],
  role: RoleUtilisateur,
) {
  return elements.filter((e) => e.roles.includes(role));
}
