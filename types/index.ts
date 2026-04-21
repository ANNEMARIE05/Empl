export type RoleUtilisateur = "rh" | "manager" | "employe";

export type StatutDemandeConge =
  | "brouillon"
  | "en_attente"
  | "valide"
  | "refuse"
  | "annule";

export type StatutDemandeDocument =
  | "en_attente"
  | "en_traitement"
  | "pret"
  | "refuse";

export type TypeConge =
  | "annuel"
  | "sans_solde"
  | "maladie"
  | "maternite"
  | "autre";

export type TypeDocument =
  | "attestation_salaire"
  | "certificat_travail"
  | "rib"
  | "convention_stage"
  | "autre";

export interface Employe {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  departement: string;
  poste: string;
  dateEmbauche: string;
  photoUrl?: string;
}

export interface DemandeConge {
  id: string;
  employeId: string;
  type: TypeConge;
  dateDebut: string;
  dateFin: string;
  statut: StatutDemandeConge;
  motif?: string;
  /** Visible côté employé dans le suivi */
  commentaireRh?: string;
  /** Notes internes RH (non affichées employé dans ce mock) */
  noteInterneRh?: string;
  creeLe: string;
}

export interface DemandeDocument {
  id: string;
  employeId: string;
  type: TypeDocument;
  statut: StatutDemandeDocument;
  commentaireEmploye?: string;
  commentaireRh?: string;
  creeLe: string;
}

export interface NotificationItem {
  id: string;
  destinataireId: string;
  titre: string;
  message: string;
  lue: boolean;
  creeLe: string;
}

export type IdOnglet =
  | "tableau-bord"
  | "mon-profil"
  | "mes-conges"
  | "absences"
  | "mes-documents"
  | "employes"
  | "conges"
  | "documents"
  | "statistiques"
  | "notifications"
  | "historique"
  | "parametrage"
  | "parametres";
