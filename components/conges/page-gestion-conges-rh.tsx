"use client";

import * as React from "react";
import { differenceInDays, format, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Calendar,
  CalendarCheck,
  Check,
  Clock,
  Filter,
  MessageSquare,
  Search,
  User,
  X,
  FileText,
} from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Pagination } from "@/components/ui/pagination";
import { useCallback, useMemo, useRef, useState } from "react";
import { CalendrierConges } from "@/components/conges/calendrier-conges";
import { libelleStatutConge, libelleTypeConge } from "@/components/conges/libelles-conges";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { EntetePage } from "@/components/ui/entete-page";
import { GrilleStatsKpi } from "@/components/ui/grille-stats-kpi";
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
import { ToggleVue, type ModeVue } from "@/components/ui/toggle-vue";
import { ContenuDialogue, Dialogue, EnteteDialogue, PiedDialogue, TitreDialogue } from "@/components/ui/dialog";
import { useConges, useMiseAJourCongeRh } from "@/hooks/queries/use-conges";
import { useEmployes } from "@/hooks/queries/use-employes";
import type { DemandeConge, StatutDemandeConge, TypeConge } from "@/types";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const couleurAccentConges = "#d4a500";

/** Masque le rectangle gris du survol Recharts (Tooltip). */
const curseurInfobulleInvisible = { fillOpacity: 0, strokeOpacity: 0 };

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

  const [modalOuverte, setModalOuverte] = useState(false);
  const [demandeSelectionnee, setDemandeSelectionnee] = useState<DemandeConge | null>(null);
  const [commentaireRh, setCommentaireRh] = useState("");
  const [actionModal, setActionModal] = useState<"valider" | "refuser" | "traiter">("traiter");

  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutDemandeConge | "tous">("tous");
  const [filtreType, setFiltreType] = useState<TypeConge | "tous">("tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [modeVue, setModeVue] = useState<ModeVue>("tableau");
  const [jourFiltreCalendrier, setJourFiltreCalendrier] = useState<Date | null>(null);
  const refSectionListeDemandes = useRef<HTMLDivElement>(null);

  const selectionnerJourCalendrier = useCallback((jour: Date | null) => {
    setJourFiltreCalendrier(jour);
    if (jour) {
      requestAnimationFrame(() => {
        refSectionListeDemandes.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const parEmploye = useMemo(() => {
    const map = new Map<string, { nom: string; poste?: string }>();
    employes.forEach((e) => map.set(e.id, { nom: `${e.prenom} ${e.nom}`, poste: e.poste }));
    return map;
  }, [employes]);

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

      let matchJour = true;
      if (jourFiltreCalendrier) {
        try {
          matchJour = isWithinInterval(jourFiltreCalendrier, {
            start: parseISO(d.dateDebut),
            end: parseISO(d.dateFin),
          });
        } catch {
          matchJour = false;
        }
      }

      return matchRecherche && matchStatut && matchType && matchJour;
    });
  }, [conges, recherche, filtreStatut, filtreType, jourFiltreCalendrier, parEmploye]);

  const congesPagines = useMemo(() => {
    const debut = (pageCourante - 1) * ITEMS_PAR_PAGE;
    return congesFiltres.slice(debut, debut + ITEMS_PAR_PAGE);
  }, [congesFiltres, pageCourante]);

  React.useEffect(() => {
    setPageCourante(1);
  }, [recherche, filtreStatut, filtreType, jourFiltreCalendrier]);

  const ouvrirModal = (demande: DemandeConge, action: "valider" | "refuser" | "traiter") => {
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

    const nouveauStatut: StatutDemandeConge =
      actionModal === "valider" ? "valide" : actionModal === "refuser" ? "refuse" : demandeSelectionnee.statut;

    await mutation.mutateAsync({
      id: demandeSelectionnee.id,
      commentaireRh,
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

  const statsConges = useMemo(() => {
    const enAttente = conges.filter((c) => c.statut === "en_attente").length;
    const valides = conges.filter((c) => c.statut === "valide").length;
    const refuses = conges.filter((c) => c.statut === "refuse").length;
    return { enAttente, valides, refuses };
  }, [conges]);

  const donneesGraphiqueStats = useMemo(
    () =>
      [
        { statut: "en_attente" as const, nom: "En attente", valeur: statsConges.enAttente },
        { statut: "valide" as const, nom: "Valides", valeur: statsConges.valides },
        { statut: "refuse" as const, nom: "Refusés", valeur: statsConges.refuses },
      ] as const,
    [statsConges.enAttente, statsConges.valides, statsConges.refuses],
  );

  const couleurBarreStatut = (statut: "en_attente" | "valide" | "refuse") => {
    if (statut === "valide") return "#22c55e";
    if (statut === "refuse") return "#ef4444";
    return couleurAccentConges;
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <EntetePage
        icone={<Calendar className="size-5 sm:size-6 text-[var(--accent-principal)]" />}
        titre="Gestion des conges"
        description={
          <>
            {congesFiltres.length} demande{congesFiltres.length > 1 ? "s" : ""} apres filtrage
            {filtreStatut === "en_attente" && " (en attente de traitement)"}
          </>
        }
      />
      <div className="flex flex-col gap-2 sm:gap-4 xl:gap-6 xl:flex-row xl:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-4">
          <GrilleStatsKpi colonnes={3} className="shrink-0">
            <motion.div
              className="min-h-0"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Carte className="relative flex h-full min-h-0 overflow-hidden border-l-2 border-l-[var(--accent-principal)] sm:min-h-[7.25rem]">
                <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent-principal)]/12 blur-2xl" />
                <CarteContenu className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 p-2 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-principal)]/15 sm:size-12 sm:rounded-2xl">
                    <Clock className="size-4 text-[var(--accent-principal)] sm:size-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col-reverse items-center gap-0.5 sm:flex-col sm:items-start sm:gap-0 sm:pt-0">
                    <p className="text-[10px] font-medium text-[var(--texte-secondaire)] sm:text-sm">En attente</p>
                    <p className="text-base font-bold tabular-nums text-[var(--accent-principal)] sm:text-2xl md:text-3xl">
                      <NombreAnime valeur={statsConges.enAttente} />
                    </p>
                  </div>
                </CarteContenu>
              </Carte>
            </motion.div>

            <motion.div
              className="min-h-0"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Carte className="relative flex h-full min-h-0 overflow-hidden border-l-2 border-l-emerald-500 sm:min-h-[7.25rem]">
                <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-500/12 blur-2xl" />
                <CarteContenu className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 p-2 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 sm:size-12 sm:rounded-2xl">
                    <CalendarCheck className="size-4 text-emerald-600 sm:size-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col-reverse items-center gap-0.5 sm:flex-col sm:items-start sm:gap-0 sm:pt-0">
                    <p className="text-[10px] font-medium text-[var(--texte-secondaire)] sm:text-sm">Valides</p>
                    <p className="text-base font-bold tabular-nums text-emerald-600 sm:text-2xl md:text-3xl">
                      <NombreAnime valeur={statsConges.valides} />
                    </p>
                  </div>
                </CarteContenu>
              </Carte>
            </motion.div>

            <motion.div
              className="min-h-0"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Carte className="relative flex h-full min-h-0 overflow-hidden border-l-2 border-l-red-500 sm:min-h-[7.25rem]">
                <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-red-500/12 blur-2xl" />
                <CarteContenu className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 p-2 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15 sm:size-12 sm:rounded-2xl">
                    <X className="size-4 text-red-600 sm:size-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col-reverse items-center gap-0.5 sm:flex-col sm:items-start sm:gap-0 sm:pt-0">
                    <p className="text-[10px] font-medium text-[var(--texte-secondaire)] sm:text-sm">Refusés</p>
                    <p className="text-base font-bold tabular-nums text-red-600 sm:text-2xl md:text-3xl">
                      <NombreAnime valeur={statsConges.refuses} />
                    </p>
                  </div>
                </CarteContenu>
              </Carte>
            </motion.div>
          </GrilleStatsKpi>

          <Carte className="flex max-xl:min-h-[18rem] flex-1 flex-col overflow-hidden xl:min-h-0">
            <CarteEntete className="shrink-0 pb-3 pt-5">
              <CarteTitre className="text-lg">Repartition des demandes</CarteTitre>
              <CarteDescription>Memes totaux que les trois indicateurs du dessus</CarteDescription>
            </CarteEntete>
            <CarteContenu className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-0">
              <div className="min-h-0 w-full flex-1 max-xl:min-h-[12rem]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...donneesGraphiqueStats]} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" vertical={false} />
                    <XAxis
                      dataKey="nom"
                      tick={{ fontSize: 12 }}
                      stroke="var(--texte-secondaire)"
                      interval={0}
                      tickMargin={10}
                    />
                    <YAxis allowDecimals={false} width={36} tick={{ fontSize: 11 }} stroke="var(--texte-secondaire)" />
                    <Tooltip
                      cursor={curseurInfobulleInvisible}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--bordure)",
                        background: "var(--surface-elevee)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      labelStyle={{ color: "var(--texte-principal)" }}
                    />
                    <Bar dataKey="valeur" name="Demandes" radius={[8, 8, 0, 0]} maxBarSize={88}>
                      {donneesGraphiqueStats.map((e) => (
                        <Cell key={e.statut} fill={couleurBarreStatut(e.statut)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CarteContenu>
          </Carte>
        </div>

        <div className="flex shrink-0 xl:h-full xl:min-h-0 xl:w-[380px] xl:self-stretch">
          <CalendrierConges
            demandes={conges}
            compact
            className="h-full min-h-0"
            jourSelectionne={jourFiltreCalendrier}
            onSelectionnerJour={selectionnerJourCalendrier}
          />
        </div>
      </div>

      <Dialogue
        open={Boolean(modalOuverte && demandeSelectionnee)}
        onOpenChange={(ouvert) => {
          if (!ouvert) fermerModal();
        }}
      >
        {demandeSelectionnee && (
          <ContenuDialogue className="max-w-lg sm:max-w-2xl">
            <EnteteDialogue>
              <TitreDialogue>
                {actionModal === "valider" && "Valider la demande"}
                {actionModal === "refuser" && "Refuser la demande"}
                {actionModal === "traiter" && "Traiter la demande"}
              </TitreDialogue>
            </EnteteDialogue>
            <div className="grid gap-2.5 sm:gap-4 pt-1.5 sm:pt-2">
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
                    <span>
                      {calculerJours(demandeSelectionnee.dateDebut, demandeSelectionnee.dateFin)} jour(s)
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock className="size-3" />
                    <span>
                      {format(parseISO(demandeSelectionnee.dateDebut), "d MMM", { locale: fr })} -{" "}
                      {format(parseISO(demandeSelectionnee.dateFin), "d MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                </div>
                {demandeSelectionnee.motif && (
                  <p className="mt-3 border-t border-[var(--bordure)] pt-3 text-sm text-[var(--texte-secondaire)]">
                    <span className="font-medium text-[var(--texte-principal)]">Motif:</span> {demandeSelectionnee.motif}
                  </p>
                )}
              </div>
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
              <PiedDialogue className="border-t border-[var(--bordure)] pt-4">
                <Bouton type="button" variante="secondaire" className="w-full sm:w-auto" onClick={fermerModal}>
                  Annuler
                </Bouton>
                <Bouton
                  className="w-full sm:w-auto"
                  type="button"
                  onClick={() => void confirmerAction()}
                  disabled={mutation.isPending}
                  variante={actionModal === "refuser" ? "destructif" : "defaut"}
                >
                  {mutation.isPending
                    ? "En cours..."
                    : actionModal === "valider"
                      ? "Valider"
                      : actionModal === "refuser"
                        ? "Refuser"
                        : "Enregistrer"}
                </Bouton>
              </PiedDialogue>
            </div>
          </ContenuDialogue>
        )}
      </Dialogue>

      <div ref={refSectionListeDemandes} className="grid scroll-mt-20 gap-2 sm:gap-4 lg:gap-6">
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
              <ToggleVue mode={modeVue} onChangerMode={setModeVue} />
            </div>
          </CarteEntete>
          <CarteContenu className="space-y-4">
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
                    type="button"
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
                {jourFiltreCalendrier && (
                  <Bouton
                    type="button"
                    variante="fantome"
                    taille="sm"
                    className="shrink-0 gap-1 text-[var(--texte-secondaire)]"
                    onClick={() => setJourFiltreCalendrier(null)}
                  >
                    <X className="size-3.5" />
                    <span className="hidden sm:inline">
                      Jour&nbsp;: {format(jourFiltreCalendrier, "d MMM yyyy", { locale: fr })}
                    </span>
                    <span className="sm:hidden">Jour</span>
                  </Bouton>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Squelette className="h-24 w-full rounded-xl" />
                <Squelette className="h-24 w-full rounded-xl" />
                <Squelette className="h-24 w-full rounded-xl" />
              </div>
            ) : modeVue === "grille" ? (
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
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-principal)]/10 text-[var(--accent-principal)]">
                              <User className="size-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--texte-principal)]">{emp?.nom ?? d.employeId}</p>
                              {emp?.poste && <p className="text-xs text-[var(--texte-secondaire)]">{emp.poste}</p>}
                            </div>
                          </div>
                          <Pastille ton={pastilleStatut(d.statut)} className="flex items-center gap-1">
                            {getStatutIcon(d.statut)}
                            {libelleStatutConge(d.statut)}
                          </Pastille>
                        </div>

                        <div className="mb-3 space-y-2 rounded-lg bg-[var(--surface-mute)] p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--texte-secondaire)]">Type</span>
                            <span className="font-medium text-[var(--texte-principal)]">{libelleTypeConge(d.type)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--texte-secondaire)]">Duree</span>
                            <span className="font-medium text-[var(--texte-principal)]">
                              {nbJours} jour{nbJours > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--texte-secondaire)]">Periode</span>
                            <span className="text-xs text-[var(--texte-principal)]">
                              {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} -{" "}
                              {format(parseISO(d.dateFin), "d MMM", { locale: fr })}
                            </span>
                          </div>
                        </div>

                        {d.motif && (
                          <p className="mb-3 text-xs text-[var(--texte-secondaire)]">
                            <span className="font-medium">Motif:</span> {d.motif}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          {d.statut === "en_attente" ? (
                            <>
                              <Bouton
                                taille="sm"
                                variante="defaut"
                                className="flex-1"
                                disabled={mutation.isPending}
                                onClick={() => ouvrirModal(d, "valider")}
                              >
                                <Check className="size-4" />
                                Accepter
                              </Bouton>
                              <Bouton
                                taille="sm"
                                variante="destructif"
                                className="flex-1"
                                disabled={mutation.isPending}
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
                              disabled={mutation.isPending}
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
                              <p className="font-medium text-[var(--texte-principal)]">{emp?.nom ?? d.employeId}</p>
                              {emp?.poste && <p className="text-xs text-[var(--texte-secondaire)]">{emp.poste}</p>}
                            </div>
                          </TableauCellule>
                          <TableauCellule>{libelleTypeConge(d.type)}</TableauCellule>
                          <TableauCellule className="whitespace-nowrap text-sm">
                            {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} -{" "}
                            {format(parseISO(d.dateFin), "d MMM", { locale: fr })}
                          </TableauCellule>
                          <TableauCellule className="text-center font-medium">{nbJours}</TableauCellule>
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
                                    disabled={mutation.isPending}
                                    onClick={() => ouvrirModal(d, "valider")}
                                  >
                                    <Check className="size-3" />
                                    Accepter
                                  </Bouton>
                                  <Bouton
                                    taille="sm"
                                    variante="destructif"
                                    disabled={mutation.isPending}
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
                                  disabled={mutation.isPending}
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

            {congesFiltres.length > 0 && (
              <div className="border-t border-[var(--bordure)]/50 pt-4">
                <Pagination
                  pageActuelle={pageCourante}
                  totalPages={Math.max(1, Math.ceil(congesFiltres.length / ITEMS_PAR_PAGE))}
                  onChangerPage={setPageCourante}
                  nombreElementsTotal={congesFiltres.length}
                  taillePage={ITEMS_PAR_PAGE}
                />
              </div>
            )}
          </CarteContenu>
        </Carte>
      </div>
    </div>
  );
}
