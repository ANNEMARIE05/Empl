import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { libelleStatutConge, libelleTypeConge } from "@/components/conges/libelles-conges";
import { libelleStatutDocument, libelleTypeDocument } from "@/components/documents/libelles-documents";
import type { AbsenceDemo } from "@/lib/donnees-absences-demo";
import { libelleStatutAbsence } from "@/lib/donnees-absences-demo";
import type {
  DemandeConge,
  DemandeDocument,
  Employe,
  NotificationItem,
  RoleUtilisateur,
  StatutDemandeConge,
  StatutDemandeDocument,
} from "@/types";

/** Aligné sur les zones de l’application (menu latéral / onglets). */
export type ModuleHistorique = "conges" | "documents" | "notifications" | "absences";

export type TonPastilleHistorique = "succes" | "accent" | "alerte" | "danger" | "neutre";

export interface LigneHistorique {
  id: string;
  quand: Date;
  module: ModuleHistorique;
  /** Libellé lisible du module (ex. « Congés », « Documents »). */
  espace: string;
  /** Personne concernée par la ligne (demandeur, destinataire, etc.). */
  collaborateur: string;
  employeConcerneId: string;
  /** Intitulé court de l’événement. */
  evenement: string;
  /** Précisions : dates, type, message, commentaire RH… */
  detail: string;
  /** Libellé du badge de suivi (statut métier). */
  etat: string;
  tonEtat: TonPastilleHistorique;
  employeIdsConcernes: string[];
}

const LIBELLES_ESPACE: Record<ModuleHistorique, string> = {
  conges: "Congés",
  documents: "Documents",
  notifications: "Notifications",
  absences: "Absences",
};

function formatNomEmploye(e: Employe): string {
  return `${e.prenom} ${e.nom}`.trim();
}

function nomEmployeOuDefaut(
  employeId: string,
  carnet: Map<string, Employe>,
  utilisateur: Employe | null,
): string {
  const trouve = carnet.get(employeId);
  if (trouve) return formatNomEmploye(trouve);
  if (utilisateur?.id === employeId) return formatNomEmploye(utilisateur);
  return "Collaborateur";
}

function premierRh(carnet: Map<string, Employe>): string {
  for (const e of carnet.values()) {
    if (e.role === "rh") return formatNomEmploye(e);
  }
  return "Équipe RH";
}

function decalageIso(iso: string, ms: number): Date {
  const d = new Date(iso);
  d.setTime(d.getTime() + ms);
  return d;
}

function tonDepuisStatutConge(statut: StatutDemandeConge): TonPastilleHistorique {
  if (statut === "valide") return "succes";
  if (statut === "refuse") return "danger";
  if (statut === "annule") return "alerte";
  if (statut === "brouillon") return "neutre";
  return "accent";
}

function tonDepuisStatutDocument(statut: StatutDemandeDocument): TonPastilleHistorique {
  if (statut === "pret") return "succes";
  if (statut === "refuse") return "danger";
  if (statut === "en_traitement") return "accent";
  return "accent";
}

function tonNotification(lue: boolean): TonPastilleHistorique {
  return lue ? "neutre" : "accent";
}

function tonAbsence(statut: AbsenceDemo["statut"]): TonPastilleHistorique {
  if (statut === "justifiee") return "succes";
  if (statut === "refusee") return "danger";
  return "accent";
}

function idsMemeDepartement(employes: Employe[], departement: string): Set<string> {
  return new Set(employes.filter((e) => e.departement === departement).map((e) => e.id));
}

export function filtrerAbsencesPourContexte(
  absences: AbsenceDemo[],
  role: RoleUtilisateur,
  utilisateur: Employe,
  employes: Employe[],
): AbsenceDemo[] {
  if (role === "rh") return absences;
  if (role === "employe") {
    return absences.filter((a) => a.employeId === utilisateur.id);
  }
  const ids = idsMemeDepartement(employes, utilisateur.departement);
  return absences.filter((a) => ids.has(a.employeId));
}

function detailConge(c: DemandeConge, periode: string): string {
  const parts = [`${libelleTypeConge(c.type)}`, `Période : ${periode}`];
  if (c.motif?.trim()) parts.push(`Motif : ${c.motif.trim()}`);
  if (c.commentaireRh?.trim()) parts.push(`Commentaire RH : ${c.commentaireRh.trim()}`);
  return parts.join(" · ");
}

function detailDocument(d: DemandeDocument): string {
  const parts = [`Type : ${libelleTypeDocument(d.type)}`];
  if (d.commentaireEmploye?.trim()) {
    parts.push(`Demande : ${d.commentaireEmploye.trim()}`);
  }
  if (d.commentaireRh?.trim()) {
    parts.push(`Commentaire RH : ${d.commentaireRh.trim()}`);
  }
  return parts.join(" · ");
}

export function construireEvenementsHistorique(input: {
  employes: Employe[];
  conges: DemandeConge[];
  documents: DemandeDocument[];
  notifications: NotificationItem[];
  absences: AbsenceDemo[];
  utilisateur: Employe;
}): LigneHistorique[] {
  const { employes, conges, documents, notifications, absences, utilisateur } = input;
  const carnet = new Map(employes.map((e) => [e.id, e] as const));
  const nomRh = premierRh(carnet);
  const liste: LigneHistorique[] = [];

  for (const c of conges) {
    const collaborateur = nomEmployeOuDefaut(c.employeId, carnet, utilisateur);
    const periode = `${format(new Date(c.dateDebut), "dd/MM/yyyy", { locale: fr })} → ${format(new Date(c.dateFin), "dd/MM/yyyy", { locale: fr })}`;
    const detail = detailConge(c, periode);
    const enCours = c.statut === "en_attente" || c.statut === "brouillon";

    if (enCours) {
      liste.push({
        id: `conge-${c.id}`,
        quand: new Date(c.creeLe),
        module: "conges",
        espace: LIBELLES_ESPACE.conges,
        collaborateur,
        employeConcerneId: c.employeId,
        evenement: c.statut === "brouillon" ? "Brouillon enregistré" : "Demande soumise",
        detail,
        etat: libelleStatutConge(c.statut),
        tonEtat: tonDepuisStatutConge(c.statut),
        employeIdsConcernes: [c.employeId],
      });
    } else {
      liste.push({
        id: `conge-soumission-${c.id}`,
        quand: new Date(c.creeLe),
        module: "conges",
        espace: LIBELLES_ESPACE.conges,
        collaborateur,
        employeConcerneId: c.employeId,
        evenement: "Demande soumise",
        detail,
        etat: "En attente",
        tonEtat: "accent",
        employeIdsConcernes: [c.employeId],
      });
      liste.push({
        id: `conge-decision-${c.id}`,
        quand: decalageIso(c.creeLe, 1),
        module: "conges",
        espace: LIBELLES_ESPACE.conges,
        collaborateur,
        employeConcerneId: c.employeId,
        evenement: `Décision RH (${nomRh})`,
        detail,
        etat: libelleStatutConge(c.statut),
        tonEtat: tonDepuisStatutConge(c.statut),
        employeIdsConcernes: [c.employeId],
      });
    }
  }

  for (const d of documents) {
    const collaborateur = nomEmployeOuDefaut(d.employeId, carnet, utilisateur);
    const detail = detailDocument(d);

    if (d.statut === "en_attente") {
      liste.push({
        id: `doc-${d.id}`,
        quand: new Date(d.creeLe),
        module: "documents",
        espace: LIBELLES_ESPACE.documents,
        collaborateur,
        employeConcerneId: d.employeId,
        evenement: "Demande transmise aux RH",
        detail,
        etat: libelleStatutDocument(d.statut),
        tonEtat: tonDepuisStatutDocument(d.statut),
        employeIdsConcernes: [d.employeId],
      });
    } else {
      liste.push({
        id: `doc-soumission-${d.id}`,
        quand: new Date(d.creeLe),
        module: "documents",
        espace: LIBELLES_ESPACE.documents,
        collaborateur,
        employeConcerneId: d.employeId,
        evenement: "Demande transmise aux RH",
        detail,
        etat: "En attente",
        tonEtat: "accent",
        employeIdsConcernes: [d.employeId],
      });
      liste.push({
        id: `doc-decision-${d.id}`,
        quand: decalageIso(d.creeLe, 1),
        module: "documents",
        espace: LIBELLES_ESPACE.documents,
        collaborateur,
        employeConcerneId: d.employeId,
        evenement: `Traitement RH (${nomRh})`,
        detail,
        etat: libelleStatutDocument(d.statut),
        tonEtat: tonDepuisStatutDocument(d.statut),
        employeIdsConcernes: [d.employeId],
      });
    }
  }

  for (const n of notifications) {
    const collaborateur = nomEmployeOuDefaut(n.destinataireId, carnet, utilisateur);
    liste.push({
      id: `notif-${n.id}`,
      quand: new Date(n.creeLe),
      module: "notifications",
      espace: LIBELLES_ESPACE.notifications,
      collaborateur,
      employeConcerneId: n.destinataireId,
      evenement: n.titre,
      detail: n.message,
      etat: n.lue ? "Lue" : "Non lue",
      tonEtat: tonNotification(n.lue),
      employeIdsConcernes: [n.destinataireId],
    });
  }

  for (const a of absences) {
    const debut = format(a.du, "dd/MM/yyyy", { locale: fr });
    const fin = a.au ? format(a.au, "dd/MM/yyyy", { locale: fr }) : null;
    const plage = fin ? `${debut} → ${fin}` : debut;
    const detailAbs = [`Motif : ${a.motif}`, `Période : ${plage}`].join(" · ");

    if (a.statut === "en_attente") {
      liste.push({
        id: `abs-${a.id}`,
        quand: a.du,
        module: "absences",
        espace: LIBELLES_ESPACE.absences,
        collaborateur: a.employe,
        employeConcerneId: a.employeId,
        evenement: "Déclaration enregistrée",
        detail: detailAbs,
        etat: libelleStatutAbsence(a.statut),
        tonEtat: tonAbsence(a.statut),
        employeIdsConcernes: [a.employeId],
      });
    } else {
      liste.push({
        id: `abs-soumission-${a.id}`,
        quand: a.du,
        module: "absences",
        espace: LIBELLES_ESPACE.absences,
        collaborateur: a.employe,
        employeConcerneId: a.employeId,
        evenement: "Déclaration enregistrée",
        detail: detailAbs,
        etat: "En attente",
        tonEtat: "accent",
        employeIdsConcernes: [a.employeId],
      });
      liste.push({
        id: `abs-statut-${a.id}`,
        quand: new Date(a.du.getTime() + 1),
        module: "absences",
        espace: LIBELLES_ESPACE.absences,
        collaborateur: a.employe,
        employeConcerneId: a.employeId,
        evenement: `Suivi RH (${nomRh})`,
        detail: detailAbs,
        etat: libelleStatutAbsence(a.statut),
        tonEtat: tonAbsence(a.statut),
        employeIdsConcernes: [a.employeId],
      });
    }
  }

  liste.sort((x, y) => y.quand.getTime() - x.quand.getTime());
  return liste;
}
