"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { 
  Check, 
  Clock, 
  FileText, 
  Filter, 
  MessageSquare, 
  Search, 
  User, 
  X,
  Loader2
} from "lucide-react";
import { libelleStatutDocument, libelleTypeDocument } from "@/components/documents/libelles-documents";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Etiquette } from "@/components/ui/label";
import { Pastille, type PastilleProps } from "@/components/ui/badge";
import { Squelette } from "@/components/ui/skeleton";
import {
  Tableau,
  TableauCellule,
  TableauCelluleEntete,
  TableauCorps,
  TableauEntete,
  TableauRangee,
} from "@/components/ui/table";
import { ZoneTexte } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/pagination";
import { ToggleVue, type ModeVue } from "@/components/ui/toggle-vue";
import { useDocuments, useMiseAJourDocumentRh } from "@/hooks/queries/use-documents";
import { useEmployes } from "@/hooks/queries/use-employes";
import type { DemandeDocument, StatutDemandeDocument, TypeDocument } from "@/types";

const ITEMS_PAR_PAGE = 6;

function pastilleStatut(statut: StatutDemandeDocument): NonNullable<PastilleProps["ton"]> {
  if (statut === "pret") return "succes";
  if (statut === "refuse") return "danger";
  if (statut === "en_traitement") return "accent";
  return "alerte";
}

function getStatutIcon(statut: StatutDemandeDocument) {
  if (statut === "pret") return <Check className="size-3" />;
  if (statut === "refuse") return <X className="size-3" />;
  if (statut === "en_traitement") return <Loader2 className="size-3 animate-spin" />;
  return <Clock className="size-3" />;
}

export function PageDocumentsRh() {
  const { data: documents = [], isLoading } = useDocuments();
  const { data: employes = [] } = useEmployes();
  const mutation = useMiseAJourDocumentRh();

  // Modal state
  const [modalOuverte, setModalOuverte] = useState(false);
  const [demandeSelectionnee, setDemandeSelectionnee] = useState<DemandeDocument | null>(null);
  const [commentaireRh, setCommentaireRh] = useState("");
  const [actionModal, setActionModal] = useState<"pret" | "refuser" | "traiter">("traiter");

  // Filtres et recherche
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutDemandeDocument | "tous">("tous");
  const [filtreType, setFiltreType] = useState<TypeDocument | "tous">("tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [modeVue, setModeVue] = useState<ModeVue>("tableau");

  const noms = useMemo(() => {
    const m = new Map<string, { nom: string; poste?: string }>();
    employes.forEach((e) => m.set(e.id, { nom: `${e.prenom} ${e.nom}`, poste: e.poste }));
    return m;
  }, [employes]);

  // Filtrage des documents
  const documentsFiltres = useMemo(() => {
    return documents.filter((d) => {
      const nomEmploye = noms.get(d.employeId)?.nom.toLowerCase() ?? "";
      const matchRecherche =
        recherche === "" ||
        nomEmploye.includes(recherche.toLowerCase()) ||
        libelleTypeDocument(d.type).toLowerCase().includes(recherche.toLowerCase());

      const matchStatut = filtreStatut === "tous" || d.statut === filtreStatut;
      const matchType = filtreType === "tous" || d.type === filtreType;

      return matchRecherche && matchStatut && matchType;
    });
  }, [documents, recherche, filtreStatut, filtreType, noms]);

  // Pagination
  const documentsPagines = useMemo(() => {
    const debut = (pageCourante - 1) * ITEMS_PAR_PAGE;
    return documentsFiltres.slice(debut, debut + ITEMS_PAR_PAGE);
  }, [documentsFiltres, pageCourante]);

  useEffect(() => {
    setPageCourante(1);
  }, [recherche, filtreStatut, filtreType]);

  const ouvrirModal = (demande: DemandeDocument, action: "pret" | "refuser" | "traiter") => {
    setDemandeSelectionnee(demande);
    setCommentaireRh(demande.commentaireRh ?? "");
    setActionModal(action);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setDemandeSelectionnee(null);
    setCommentaireRh("");
  };

  const confirmerAction = async () => {
    if (!demandeSelectionnee) return;
    
    const nouveauStatut: StatutDemandeDocument = 
      actionModal === "pret" ? "pret" : 
      actionModal === "refuser" ? "refuse" : 
      demandeSelectionnee.statut;

    await mutation.mutateAsync({
      id: demandeSelectionnee.id,
      commentaireRh,
      statut: nouveauStatut,
    });
    
    fermerModal();
  };

  const statutsDisponibles: { value: StatutDemandeDocument | "tous"; label: string }[] = [
    { value: "tous", label: "Tous les statuts" },
    { value: "en_attente", label: "En attente" },
    { value: "en_traitement", label: "En traitement" },
    { value: "pret", label: "Validés" },
    { value: "refuse", label: "Refuse" },
  ];

  const typesDisponibles: { value: TypeDocument | "tous"; label: string }[] = [
    { value: "tous", label: "Tous les types" },
    { value: "attestation_salaire", label: "Attestation de salaire" },
    { value: "certificat_travail", label: "Certificat de travail" },
    { value: "fiche_paie", label: "Fiche de paie" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <>
      {/* Modal de traitement */}
      {modalOuverte && demandeSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--bordure)] bg-[var(--surface-elevee)] shadow-2xl">
            <div className="border-b border-[var(--bordure)] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--texte-principal)]">
                  {actionModal === "pret" && "Valider la demande"}
                  {actionModal === "refuser" && "Refuser la demande"}
                  {actionModal === "traiter" && "Traiter la demande"}
                </h2>
                <button 
                  onClick={fermerModal}
                  className="rounded-lg p-2 text-[var(--texte-secondaire)] hover:bg-[var(--surface-mute)] hover:text-[var(--texte-principal)]"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4 p-5">
              {/* Info demande */}
              <div className="rounded-xl bg-[var(--surface-mute)] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="size-4 text-[var(--accent-principal)]" />
                  <span className="font-medium">
                    {noms.get(demandeSelectionnee.employeId)?.nom ?? demandeSelectionnee.employeId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-[var(--texte-secondaire)]">
                  <div className="flex items-center gap-2">
                    <FileText className="size-3" />
                    <span>{libelleTypeDocument(demandeSelectionnee.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3" />
                    <span>{format(parseISO(demandeSelectionnee.creeLe), "d MMM yyyy", { locale: fr })}</span>
                  </div>
                </div>
                {demandeSelectionnee.commentaireEmploye && (
                  <p className="mt-3 border-t border-[var(--bordure)] pt-3 text-sm text-[var(--texte-secondaire)]">
                    <span className="font-medium text-[var(--texte-principal)]">Message de l&apos;employe:</span> {demandeSelectionnee.commentaireEmploye}
                  </p>
                )}
              </div>

              {/* Commentaire RH */}
              <div className="space-y-2">
                <Etiquette htmlFor="commentaire-rh">Commentaire pour l&apos;employe</Etiquette>
                <ZoneTexte
                  id="commentaire-rh"
                  rows={3}
                  value={commentaireRh}
                  onChange={(e) => setCommentaireRh(e.target.value)}
                  placeholder="Ce commentaire sera visible par l'employe..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--bordure)] p-5">
              <Bouton variante="fantome" onClick={fermerModal}>
                Annuler
              </Bouton>
              <Bouton 
                onClick={() => void confirmerAction()}
                disabled={mutation.isPending}
                variante={actionModal === "refuser" ? "destructif" : "defaut"}
              >
                {mutation.isPending ? "En cours..." : (
                  actionModal === "pret" ? "Valider" :
                  actionModal === "refuser" ? "Refuser" :
                  "Enregistrer"
                )}
              </Bouton>
            </div>
          </div>
        </div>
      )}

      <Carte>
        <CarteEntete>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CarteTitre>Demandes de documents</CarteTitre>
              <CarteDescription>
                {documentsFiltres.length} demande{documentsFiltres.length > 1 ? "s" : ""}
                {filtreStatut === "en_attente" && " en attente de traitement"}
              </CarteDescription>
            </div>
            <ToggleVue mode={modeVue} onChangerMode={setModeVue} />
          </div>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="h-10 w-full rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] pl-10 pr-10 text-sm placeholder:text-[var(--texte-secondaire)] focus:border-[var(--accent-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-principal)]/20"
              />
              {recherche && (
                <button
                  onClick={() => setRecherche("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--texte-secondaire)] hover:text-[var(--texte-principal)]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-[var(--texte-secondaire)]" />
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value as StatutDemandeDocument | "tous")}
                className="h-10 rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm focus:border-[var(--accent-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-principal)]/20"
              >
                {statutsDisponibles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value as TypeDocument | "tous")}
                className="h-10 rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm focus:border-[var(--accent-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-principal)]/20"
              >
                {typesDisponibles.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Squelette className="h-24 w-full rounded-xl" />
              <Squelette className="h-24 w-full rounded-xl" />
              <Squelette className="h-24 w-full rounded-xl" />
            </div>
          ) : modeVue === "grille" ? (
            /* Vue Grille */
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {documentsPagines.length === 0 ? (
                <div className="col-span-full py-12 text-center text-[var(--texte-secondaire)]">
                  Aucune demande trouvee
                </div>
              ) : (
                documentsPagines.map((d) => {
                  const emp = noms.get(d.employeId);
                  
                  return (
                    <div
                      key={d.id}
                      className="rounded-xl border border-[var(--bordure)] bg-[var(--fond-base)] p-4 transition-all hover:border-[var(--accent-principal)]/30 hover:shadow-md"
                    >
                      {/* Header */}
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-principal)]/10 text-[var(--accent-principal)]">
                            <FileText className="size-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--texte-principal)]">
                              {emp?.nom ?? d.employeId}
                            </p>
                            <p className="text-xs text-[var(--texte-secondaire)]">
                              {libelleTypeDocument(d.type)}
                            </p>
                          </div>
                        </div>
                        <Pastille ton={pastilleStatut(d.statut)} className="flex items-center gap-1">
                          {getStatutIcon(d.statut)}
                          {libelleStatutDocument(d.statut)}
                        </Pastille>
                      </div>

                      {/* Infos */}
                      <div className="mb-3 rounded-lg bg-[var(--surface-mute)] p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--texte-secondaire)]">Date demande</span>
                          <span className="text-[var(--texte-principal)]">
                            {format(parseISO(d.creeLe), "d MMM yyyy", { locale: fr })}
                          </span>
                        </div>
                      </div>

                      {d.commentaireEmploye && (
                        <p className="mb-3 truncate text-xs text-[var(--texte-secondaire)]">
                          <span className="font-medium">Note:</span> {d.commentaireEmploye}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {d.statut === "en_attente" || d.statut === "en_traitement" ? (
                          <>
                            <Bouton
                              taille="sm"
                              variante="defaut"
                              className="flex-1"
                              onClick={() => ouvrirModal(d, "pret")}
                            >
                              <Check className="size-4" />
                              Valider
                            </Bouton>
                            <Bouton
                              taille="sm"
                              variante="destructif"
                              className="flex-1"
                              onClick={() => ouvrirModal(d, "refuser")}
                            >
                              <X className="size-4" />
                              Refuser
                            </Bouton>
                          </>
                        ) : (
                          <Bouton
                            taille="sm"
                            variante="secondaire"
                            className="w-full"
                            onClick={() => ouvrirModal(d, "traiter")}
                          >
                            <MessageSquare className="size-4" />
                            Voir / Modifier
                          </Bouton>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Vue Tableau */
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete>Employe</TableauCelluleEntete>
                  <TableauCelluleEntete>Type</TableauCelluleEntete>
                  <TableauCelluleEntete>Date demande</TableauCelluleEntete>
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                  <TableauCelluleEntete className="text-right">Actions</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {documentsPagines.length === 0 ? (
                  <TableauRangee>
                    <TableauCellule colSpan={5} className="py-12 text-center text-[var(--texte-secondaire)]">
                      Aucune demande trouvee
                    </TableauCellule>
                  </TableauRangee>
                ) : (
                  documentsPagines.map((d) => {
                    const emp = noms.get(d.employeId);
                    
                    return (
                      <TableauRangee key={d.id} className="hover:bg-[var(--surface-mute)]/50">
                        <TableauCellule>
                          <div>
                            <p className="font-medium text-[var(--texte-principal)]">
                              {emp?.nom ?? d.employeId}
                            </p>
                            {emp?.poste && (
                              <p className="text-xs text-[var(--texte-secondaire)]">{emp.poste}</p>
                            )}
                          </div>
                        </TableauCellule>
                        <TableauCellule>{libelleTypeDocument(d.type)}</TableauCellule>
                        <TableauCellule className="whitespace-nowrap text-sm">
                          {format(parseISO(d.creeLe), "d MMM yyyy", { locale: fr })}
                        </TableauCellule>
                        <TableauCellule>
                          <Pastille ton={pastilleStatut(d.statut)} className="flex w-fit items-center gap-1">
                            {getStatutIcon(d.statut)}
                            {libelleStatutDocument(d.statut)}
                          </Pastille>
                        </TableauCellule>
                        <TableauCellule className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {d.statut === "en_attente" || d.statut === "en_traitement" ? (
                              <>
                                <Bouton
                                  taille="sm"
                                  variante="defaut"
                                  onClick={() => ouvrirModal(d, "pret")}
                                >
                                  <Check className="size-3" />
                                  Valider
                                </Bouton>
                                <Bouton
                                  taille="sm"
                                  variante="destructif"
                                  onClick={() => ouvrirModal(d, "refuser")}
                                >
                                  <X className="size-3" />
                                  Refuser
                                </Bouton>
                              </>
                            ) : (
                              <Bouton
                                taille="sm"
                                variante="secondaire"
                                onClick={() => ouvrirModal(d, "traiter")}
                              >
                                <MessageSquare className="size-3" />
                                Voir
                              </Bouton>
                            )}
                          </div>
                        </TableauCellule>
                      </TableauRangee>
                    );
                  })
                )}
              </TableauCorps>
            </Tableau>
          )}

          {/* Pagination */}
          {documentsFiltres.length > 0 && (
            <div className="border-t border-[var(--bordure)]/50 pt-4">
              <Pagination
                pageActuelle={pageCourante}
                totalPages={Math.max(1, Math.ceil(documentsFiltres.length / ITEMS_PAR_PAGE))}
                onChangerPage={setPageCourante}
                nombreElementsTotal={documentsFiltres.length}
                taillePage={ITEMS_PAR_PAGE}
              />
            </div>
          )}
        </CarteContenu>
      </Carte>
    </>
  );
}
