import type {
  DemandeConge,
  DemandeDocument,
  Employe,
  NotificationItem,
} from "@/types";

export const employesMock: Employe[] = [
  {
    id: "e1",
    prenom: "Marie",
    nom: "Dubois",
    email: "marie.dubois@entreprise.fr",
    role: "rh",
    departement: "Ressources humaines",
    poste: "Responsable RH",
    dateEmbauche: "2018-03-12",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a7a8?w=200&h=200&fit=crop",
  },
  {
    id: "e2",
    prenom: "Thomas",
    nom: "Martin",
    email: "thomas.martin@entreprise.fr",
    role: "employe",
    departement: "Opérations",
    poste: "Coordinateur logistique",
    dateEmbauche: "2021-09-01",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    id: "e3",
    prenom: "Léa",
    nom: "Bernard",
    email: "lea.bernard@entreprise.fr",
    role: "manager",
    departement: "Opérations",
    poste: "Manager d'équipe",
    dateEmbauche: "2019-01-15",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
  },
  {
    id: "e4",
    prenom: "Karim",
    nom: "Benali",
    email: "karim.benali@entreprise.fr",
    role: "employe",
    departement: "Finance",
    poste: "Analyste",
    dateEmbauche: "2022-04-18",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
];

const aujourdhui = new Date();
const y = aujourdhui.getFullYear();
const m = String(aujourdhui.getMonth() + 1).padStart(2, "0");

export const demandesCongesInitial: DemandeConge[] = [
  {
    id: "c1",
    employeId: "e2",
    type: "annuel",
    dateDebut: `${y}-${m}-05`,
    dateFin: `${y}-${m}-12`,
    statut: "en_attente",
    motif: "Vacances famille",
    commentaireRh: "",
    creeLe: `${y}-${m}-01T10:00:00Z`,
  },
  {
    id: "c2",
    employeId: "e4",
    type: "sans_solde",
    dateDebut: `${y}-${m}-20`,
    dateFin: `${y}-${m}-22`,
    statut: "en_attente",
    motif: "Déplacement personnel",
    creeLe: `${y}-${m}-02T14:30:00Z`,
  },
  {
    id: "c3",
    employeId: "e2",
    type: "annuel",
    dateDebut: `${y}-${String(Number(m) % 12 || 12).padStart(2, "0")}-01`,
    dateFin: `${y}-${String(Number(m) % 12 || 12).padStart(2, "0")}-10`,
    statut: "valide",
    commentaireRh: "Validé — équipe couverte.",
    creeLe: `${y}-01-05T09:00:00Z`,
  },
];

export const demandesDocumentsInitial: DemandeDocument[] = [
  {
    id: "d1",
    employeId: "e2",
    type: "attestation_salaire",
    statut: "en_attente",
    commentaireEmploye: "Pour dossier bancaire",
    creeLe: `${y}-${m}-03T11:00:00Z`,
  },
  {
    id: "d2",
    employeId: "e4",
    type: "certificat_travail",
    statut: "pret",
    creeLe: `${y - 1}-11-10T08:00:00Z`,
    commentaireRh: "Retrait RH sur rendez-vous.",
  },
];

export const notificationsInitial: NotificationItem[] = [
  {
    id: "n1",
    destinataireId: "e1",
    titre: "Nouvelle demande de congé",
    message: "Thomas Martin a soumis une demande du 5 au 12.",
    lue: false,
    creeLe: `${y}-${m}-01T10:05:00Z`,
  },
  {
    id: "n2",
    destinataireId: "e2",
    titre: "Demande en cours d'examen",
    message: "Votre demande de congés est étudiée par les RH.",
    lue: false,
    creeLe: `${y}-${m}-01T10:10:00Z`,
  },
  {
    id: "n3",
    destinataireId: "e2",
    titre: "Document disponible",
    message: "Votre attestation de salaire est prête.",
    lue: true,
    creeLe: `${y}-${m}-04T16:00:00Z`,
  },
];
