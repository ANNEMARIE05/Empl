"use client";

import * as React from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CalendarCheck,
  Check, 
  Clock, 
  Filter, 
  LayoutGrid, 
  LayoutList, 
  MessageSquare, 
  Search, 
  TrendingUp,
  User, 
  Users,
  X,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { useMemo, useState } from "react";
import { CalendrierConges } from "@/components/conges/calendrier-conges";
import { libelleStatutConge, libelleTypeConge } from "@/components/conges/libelles-conges";
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
import { useConges, useMiseAJourCongeRh } from "@/hooks/queries/use-conges";
import { useEmployes } from "@/hooks/queries/use-employes";
import type { DemandeConge, StatutDemandeConge, TypeConge } from "@/types";

const ITEMS_PAR_PAGE = 6;

function pastilleStatut(statut: StatutDemandeConge): NonNullable<PastilleProps["ton"]> {
  if (statut === "valide") return "succes";
  if (statut === "refuse" || statut === "annule") return "danger";
  if (statut === "en_attente") return "alerte";
  return "neutre";
}

function getStatutIcon(statut: StatutDemandeConge) {
  if (statut === "valide") return <Check className="size-3" />;
  if (statut === "refuse" || statut === "annule") return <X className="size-3" />;
  return <Clock className="size-3" />;
}

export function PageGestionCongesRh() {
  const { data: conges = [], isLoading } = useConges();
  const { data: employes = [] } = useEmployes();
  const mutation = useMiseAJourCongeRh();
  
  // Modal state
  const [modalOuverte, setModalOuverte] = useState(false);
  const [demandeSelectionnee, setDemandeSelectionnee] = useState<DemandeConge | null>(null);
  const [commentaireRh, setCommentaireRh] = useState("");
  const [noteInterneRh, setNoteInterneRh] = useState("");
  const [actionModal, setActionModal] = useState<"valider" | "refuser" | "traiter">("traiter");

  // Filtres et recherche
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutDemandeConge | "tous">("tous");
  const [filtreType, setFiltreType] = useState<TypeConge | "tous">("tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [vueMode, setVueMode] = useState<"tableau" | "grille">("grille");

  const parEmploye = useMemo(() => {
    const map = new Map<string, { nom: string; poste?: string }>();
    employes.forEach((e) => map.set(e.id, { nom: `${e.prenom} ${e.nom}`, poste: e.poste }));
    return map;
  }, [employes]);

  // Filtrage des conges
  const congesFiltres = useMemo(() => {
    return conges.filter((d) => {
      const nomEmploye = parEmploye.get(d.employeId)?.nom.toLowerCase() ?? "";
      const matchRecherche =
        recherche === "" ||
        nomEmploye.includes(recherche.toLowerCase()) ||
        libelleTypeConge(d.type).toLowerCase().includes(recherche.toLowerCase()) ||
        (d.motif?.toLowerCase().includes(recherche.toLowerCase()) ?? false);

      const matchStatut = filtreStatut === "tous" || d.statut === filtreStatut;
      const matchType = filtreType === "tous" || d.type === filtreType;

      return matchRecherche && matchStatut && matchType;
    });
  }, [conges, recherche, filtreStatut, filtreType, parEmploye]);

  // Pagination
  const totalPages = Math.ceil(congesFiltres.length / ITEMS_PAR_PAGE);
  const congesPagines = useMemo(() => {
    const debut = (pageCourante - 1) * ITEMS_PAR_PAGE;
    return congesFiltres.slice(debut, debut + ITEMS_PAR_PAGE);
  }, [congesFiltres, pageCourante]);

  // Reset page quand filtre change
  React.useEffect(() => {
    setPageCourante(1);
  }, [recherche, filtreStatut, filtreType]);

  const ouvrirModal = (demande: DemandeConge, action: "valider" | "refuser" | "traiter") => {
    setDemandeSelectionnee(demande);
    setCommentaireRh(demande.commentaireRh ?? "");
    setNoteInterneRh(demande.noteInterneRh ?? "");
    setActionModal(action);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setDemandeSelectionnee(null);
    setCommentaireRh("");
    setNoteInterneRh("");
  };

  const confirmerAction = async () => {
    if (!demandeSelectionnee) return;
    
    const nouveauStatut: StatutDemandeConge = 
      actionModal === "valider" ? "valide" : 
      actionModal === "refuser" ? "refuse" : 
      demandeSelectionnee.statut;

    await mutation.mutateAsync({
      id: demandeSelectionnee.id,
      commentaireRh,
      noteInterneRh,
      statut: nouveauStatut,
    });
    
    fermerModal();
  };

  const statutsDisponibles: { value: StatutDemandeConge | "tous"; label: string }[] = [
    { value: "tous", label: "Tous les statuts" },
    { value: "en_attente", label: "En attente" },
    { value: "valide", label: "Valide" },
    { value: "refuse", label: "Refuse" },
    { value: "annule", label: "Annule" },
  ];

  const typesDisponibles: { value: TypeConge | "tous"; label: string }[] = [
    { value: "tous", label: "Tous les types" },
    { value: "annuel", label: "Annuel" },
    { value: "sans_solde", label: "Sans solde" },
    { value: "maladie", label: "Maladie" },
    { value: "maternite", label: "Maternite" },
    { value: "autre", label: "Autre" },
  ];

  const calculerJours = (debut: string, fin: string) => {
    return differenceInDays(parseISO(fin), parseISO(debut)) + 1;
  };

  // Stats calculees
  const statsConges = useMemo(() => {
    const enAttente = conges.filter((c) => c.statut === "en_attente").length;
    const valides = conges.filter((c) => c.statut === "valide").length;
    const refuses = conges.filter((c) => c.statut === "refuse").length;
    const tauxValidation = conges.length > 0 
      ? Math.round((valides / (valides + refuses || 1)) * 100) 
      : 0;
    const joursTotal = conges
      .filter((c) => c.statut === "valide")
      .reduce((acc, c) => acc + calculerJours(c.dateDebut, c.dateFin), 0);
    return { enAttente, valides, refuses, tauxValidation, joursTotal };
  }, [conges]);

  return (
    <div className="space-y-6">
      {/* Stats en haut avec calendrier en flex */}
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Stats Cards */}
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <Carte className="relative h-full overflow-hidden">
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent-principal)]/20 blur-2xl" />
              <CarteEntete>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                    <Clock className="size-5 text-[var(--accent-principal)]" />
                  </div>
                  <div>
                    <CarteTitre className="text-sm">En attente</CarteTitre>
                    <CarteDescription className="text-xs">A traiter</CarteDescription>
                  </div>
                </div>
              </CarteEntete>
              <CarteContenu>
                <p className="text-3xl font-bold text-[var(--accent-principal)]">
                  <NombreAnime valeur={statsConges.enAttente} />
                </p>
              </CarteContenu>
            </Carte>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <Carte className="h-full">
              <CarteEntete>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                    <CalendarCheck className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <CarteTitre className="text-sm">Valides</CarteTitre>
                    <CarteDescription className="text-xs">Approuves</CarteDescription>
                  </div>
                </div>
              </CarteEntete>
              <CarteContenu>
                <p className="text-3xl font-bold text-emerald-600">
                  <NombreAnime valeur={statsConges.valides} />
                </p>
              </CarteContenu>
            </Carte>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <Carte className="h-full">
              <CarteEntete>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15">
                    <TrendingUp className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <CarteTitre className="text-sm">Taux validation</CarteTitre>
                    <CarteDescription className="text-xs">Global</CarteDescription>
                  </div>
                </div>
              </CarteEntete>
              <CarteContenu>
                <p className="text-3xl font-bold text-blue-600">
                  <NombreAnime valeur={statsConges.tauxValidation} suffixe="%" />
                </p>
              </CarteContenu>
            </Carte>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <Carte className="h-full">
              <CarteEntete>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/15">
                    <Calendar className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <CarteTitre className="text-sm">Jours accordes</CarteTitre>
                    <CarteDescription className="text-xs">Total</CarteDescription>
                  </div>
                </div>
              </CarteEntete>
              <CarteContenu>
                <p className="text-3xl font-bold text-purple-600">
                  <NombreAnime valeur={statsConges.joursTotal} suffixe="j" />
                </p>
              </CarteContenu>
            </Carte>
          </motion.div>
        </div>

        {/* Calendrier en flex a droite sur xl */}
        <div className="xl:w-[420px]">
          <CalendrierConges demandes={conges} compact />
        </div>
      </div>

      {/* Modal de traitement */}
      {modalOuverte && demandeSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--bordure)] bg-[var(--surface-elevee)] shadow-2xl">
            <div className="border-b border-[var(--bordure)] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--texte-principal)]">
                  {actionModal === "valider" && "Valider la demande"}
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
                    {parEmploye.get(demandeSelectionnee.employeId)?.nom ?? demandeSelectionnee.employeId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-[var(--texte-secondaire)]">
                  <div className="flex items-center gap-2">
                    <FileText className="size-3" />
                    <span>{libelleTypeConge(demandeSelectionnee.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3" />
                    <span>{calculerJours(demandeSelectionnee.dateDebut, demandeSelectionnee.dateFin)} jour(s)</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock className="size-3" />
                    <span>
                      {format(parseISO(demandeSelectionnee.dateDebut), "d MMM", { locale: fr })} - {format(parseISO(demandeSelectionnee.dateFin), "d MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                </div>
                {demandeSelectionnee.motif && (
                  <p className="mt-3 border-t border-[var(--bordure)] pt-3 text-sm text-[var(--texte-secondaire)]">
                    <span className="font-medium text-[var(--texte-principal)]">Motif:</span> {demandeSelectionnee.motif}
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

              {/* Note interne */}
              <div className="space-y-2">
                <Etiquette htmlFor="note-interne">Note interne RH</Etiquette>
                <ZoneTexte
                  id="note-interne"
                  rows={2}
                  value={noteInterneRh}
                  onChange={(e) => setNoteInterneRh(e.target.value)}
                  placeholder="Note interne (non visible par l'employe)..."
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
                variante={actionModal === "refuser" ? "danger" : "defaut"}
              >
                {mutation.isPending ? "En cours..." : (
                  actionModal === "valider" ? "Valider" :
                  actionModal === "refuser" ? "Refuser" :
                  "Enregistrer"
                )}
              </Bouton>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <Carte>
          <CarteEntete>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CarteTitre>Demandes de conges</CarteTitre>
                <CarteDescription>
                  {congesFiltres.length} demande{congesFiltres.length > 1 ? "s" : ""} 
                  {filtreStatut === "en_attente" && " en attente de traitement"}
                </CarteDescription>
              </div>
              <div className="flex items-center gap-2">
                <Bouton
                  taille="icone"
                  variante={vueMode === "tableau" ? "defaut" : "fantome"}
                  onClick={() => setVueMode("tableau")}
                  aria-label="Vue tableau"
                >
                  <LayoutList className="size-4" />
                </Bouton>
                <Bouton
                  taille="icone"
                  variante={vueMode === "grille" ? "defaut" : "fantome"}
                  onClick={() => setVueMode("grille")}
                  aria-label="Vue grille"
                >
                  <LayoutGrid className="size-4" />
                </Bouton>
              </div>
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
                  onChange={(e) => setFiltreStatut(e.target.value as StatutDemandeConge | "tous")}
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
                  onChange={(e) => setFiltreType(e.target.value as TypeConge | "tous")}
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
            ) : vueMode === "grille" ? (
              /* Vue Grille */
              <div className="grid gap-3 sm:grid-cols-2">
                {congesPagines.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-[var(--texte-secondaire)]">
                    Aucune demande trouvee
                  </div>
                ) : (
                  congesPagines.map((d) => {
                    const emp = parEmploye.get(d.employeId);
                    const nbJours = calculerJours(d.dateDebut, d.dateFin);
                    
                    return (
                      <div
                        key={d.id}
                        className="rounded-xl border border-[var(--bordure)] bg-[var(--fond-base)] p-4 transition-all hover:border-[var(--accent-principal)]/30 hover:shadow-md"
                      >
                        {/* Header */}
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-principal)]/10 text-[var(--accent-principal)]">
                              <User className="size-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--texte-principal)]">
                                {emp?.nom ?? d.employeId}
                              </p>
                              {emp?.poste && (
                                <p className="text-xs text-[var(--texte-secondaire)]">{emp.poste}</p>
                              )}
                            </div>
                          </div>
                          <Pastille ton={pastilleStatut(d.statut)} className="flex items-center gap-1">
                            {getStatutIcon(d.statut)}
                            {libelleStatutConge(d.statut)}
                          </Pastille>
                        </div>

                        {/* Infos */}
                        <div className="mb-3 space-y-2 rounded-lg bg-[var(--surface-mute)] p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--texte-secondaire)]">Type</span>
                            <span className="font-medium text-[var(--texte-principal)]">{libelleTypeConge(d.type)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--texte-secondaire)]">Duree</span>
                            <span className="font-medium text-[var(--texte-principal)]">{nbJours} jour{nbJours > 1 ? "s" : ""}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--texte-secondaire)]">Periode</span>
                            <span className="text-xs text-[var(--texte-principal)]">
                              {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} - {format(parseISO(d.dateFin), "d MMM", { locale: fr })}
                            </span>
                          </div>
                        </div>

                        {d.motif && (
                          <p className="mb-3 text-xs text-[var(--texte-secondaire)]">
                            <span className="font-medium">Motif:</span> {d.motif}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {d.statut === "en_attente" ? (
                            <>
                              <Bouton
                                taille="sm"
                                variante="defaut"
                                className="flex-1"
                                onClick={() => ouvrirModal(d, "valider")}
                              >
                                <Check className="size-4" />
                                Accepter
                              </Bouton>
                              <Bouton
                                taille="sm"
                                variante="danger"
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
                    <TableauCelluleEntete>Periode</TableauCelluleEntete>
                    <TableauCelluleEntete>Jours</TableauCelluleEntete>
                    <TableauCelluleEntete>Statut</TableauCelluleEntete>
                    <TableauCelluleEntete className="text-right">Actions</TableauCelluleEntete>
                  </TableauRangee>
                </TableauEntete>
                <TableauCorps>
                  {congesPagines.length === 0 ? (
                    <TableauRangee>
                      <TableauCellule colSpan={6} className="py-12 text-center text-[var(--texte-secondaire)]">
                        Aucune demande trouvee
                      </TableauCellule>
                    </TableauRangee>
                  ) : (
                    congesPagines.map((d) => {
                      const emp = parEmploye.get(d.employeId);
                      const nbJours = calculerJours(d.dateDebut, d.dateFin);
                      
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
                          <TableauCellule>{libelleTypeConge(d.type)}</TableauCellule>
                          <TableauCellule className="whitespace-nowrap text-sm">
                            {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} - {format(parseISO(d.dateFin), "d MMM", { locale: fr })}
                          </TableauCellule>
                          <TableauCellule className="text-center font-medium">
                            {nbJours}
                          </TableauCellule>
                          <TableauCellule>
                            <Pastille ton={pastilleStatut(d.statut)} className="flex w-fit items-center gap-1">
                              {getStatutIcon(d.statut)}
                              {libelleStatutConge(d.statut)}
                            </Pastille>
                          </TableauCellule>
                          <TableauCellule className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {d.statut === "en_attente" ? (
                                <>
                                  <Bouton
                                    taille="sm"
                                    variante="defaut"
                                    onClick={() => ouvrirModal(d, "valider")}
                                  >
                                    <Check className="size-3" />
                                    Accepter
                                  </Bouton>
                                  <Bouton
                                    taille="sm"
                                    variante="danger"
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--bordure)] pt-4">
                <p className="text-sm text-[var(--texte-secondaire)]">
                  Page {pageCourante} sur {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Bouton
                    taille="icone"
                    variante="fantome"
                    onClick={() => setPageCourante((p) => Math.max(1, p - 1))}
                    disabled={pageCourante === 1}
                  >
                    <ChevronLeft className="size-4" />
                  </Bouton>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (pageCourante <= 3) {
                      page = i + 1;
                    } else if (pageCourante >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = pageCourante - 2 + i;
                    }
                    return (
                      <Bouton
                        key={page}
                        taille="icone"
                        variante={page === pageCourante ? "defaut" : "fantome"}
                        onClick={() => setPageCourante(page)}
                      >
                        {page}
                      </Bouton>
                    );
                  })}
                  <Bouton
                    taille="icone"
                    variante="fantome"
                    onClick={() => setPageCourante((p) => Math.min(totalPages, p + 1))}
                    disabled={pageCourante === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </Bouton>
                </div>
              </div>
            )}
          </CarteContenu>
        </Carte>
      </div>
    </div>
  );
}
