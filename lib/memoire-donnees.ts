import {
  demandesCongesInitial,
  demandesDocumentsInitial,
  employesMock,
  notificationsInitial,
} from "@/lib/donnees-mock";
import type {
  DemandeConge,
  DemandeDocument,
  Employe,
  NotificationItem,
} from "@/types";

function copieProfonde<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

let employes: Employe[] = copieProfonde(employesMock);
let demandesConges: DemandeConge[] = copieProfonde(demandesCongesInitial);
let demandesDocuments: DemandeDocument[] = copieProfonde(demandesDocumentsInitial);
let notifications: NotificationItem[] = copieProfonde(notificationsInitial);

export function reinitialiserMemoire() {
  employes = copieProfonde(employesMock);
  demandesConges = copieProfonde(demandesCongesInitial);
  demandesDocuments = copieProfonde(demandesDocumentsInitial);
  notifications = copieProfonde(notificationsInitial);
}

export function lireEmployes(): Employe[] {
  return employes;
}

export function trouverEmployeParId(id: string): Employe | undefined {
  return employes.find((e) => e.id === id);
}

export function ajouterEmploye(e: Employe): Employe {
  employes = [e, ...employes];
  return e;
}

export function mettreAJourEmploye(id: string, patch: Partial<Omit<Employe, "id">>): Employe | null {
  const idx = employes.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  employes[idx] = { ...employes[idx], ...patch };
  return employes[idx];
}

export function supprimerEmploye(id: string): boolean {
  const idx = employes.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  employes.splice(idx, 1);
  return true;
}

export function lireConges(): DemandeConge[] {
  return demandesConges;
}

export function mettreAJourConge(
  id: string,
  patch: Partial<Pick<DemandeConge, "commentaireRh" | "statut">>,
): DemandeConge | null {
  const idx = demandesConges.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  demandesConges[idx] = { ...demandesConges[idx], ...patch };
  return demandesConges[idx];
}

export function ajouterDemandeConge(d: DemandeConge) {
  demandesConges = [d, ...demandesConges];
}

export function lireDocuments(): DemandeDocument[] {
  return demandesDocuments;
}

export function mettreAJourDocument(
  id: string,
  patch: Partial<Pick<DemandeDocument, "commentaireRh" | "statut">>,
): DemandeDocument | null {
  const idx = demandesDocuments.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  demandesDocuments[idx] = { ...demandesDocuments[idx], ...patch };
  return demandesDocuments[idx];
}

export function ajouterDemandeDocument(d: DemandeDocument) {
  demandesDocuments = [d, ...demandesDocuments];
}

export function lireNotifications(): NotificationItem[] {
  return notifications;
}

export function marquerNotificationLue(id: string) {
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, lue: true } : n,
  );
}
