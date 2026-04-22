import { subDays } from "date-fns";

export type StatutAbsence = "justifiee" | "refusee" | "en_attente";

export interface AbsenceDemo {
  id: string;
  employe: string;
  employeId: string;
  motif: string;
  du: Date;
  au?: Date;
  statut: StatutAbsence;
}

export function libelleStatutAbsence(statut: StatutAbsence): string {
  if (statut === "justifiee") return "Justifiée";
  if (statut === "refusee") return "Refusée";
  return "En attente";
}

/** Données de démonstration ; employeId aligné sur lib/donnees-mock (e1..e4). */
export function creerAbsencesDemo(): AbsenceDemo[] {
  return [
    { id: "a1", employe: "Thomas Martin", employeId: "e2", motif: "RTT", du: subDays(new Date(), 6), statut: "en_attente" },
    {
      id: "a2",
      employe: "Thomas Martin",
      employeId: "e2",
      motif: "Arret maladie",
      du: subDays(new Date(), 30),
      au: subDays(new Date(), 28),
      statut: "en_attente",
    },
    {
      id: "a3",
      employe: "Léa Bernard",
      employeId: "e3",
      motif: "Teletravail exceptionnel",
      du: subDays(new Date(), 2),
      statut: "en_attente",
    },
    {
      id: "a4",
      employe: "Léa Bernard",
      employeId: "e3",
      motif: "Conge annuel",
      du: subDays(new Date(), 10),
      au: subDays(new Date(), 5),
      statut: "justifiee",
    },
    {
      id: "a5",
      employe: "Karim Benali",
      employeId: "e4",
      motif: "Arret maladie",
      du: subDays(new Date(), 18),
      au: subDays(new Date(), 15),
      statut: "justifiee",
    },
    { id: "a6", employe: "Karim Benali", employeId: "e4", motif: "RTT", du: subDays(new Date(), 1), statut: "en_attente" },
    {
      id: "a7",
      employe: "Marie Dubois",
      employeId: "e1",
      motif: "Formation",
      du: subDays(new Date(), 3),
      statut: "en_attente",
    },
    {
      id: "a8",
      employe: "Marie Dubois",
      employeId: "e1",
      motif: "Teletravail exceptionnel",
      du: subDays(new Date(), 7),
      statut: "en_attente",
    },
  ];
}
