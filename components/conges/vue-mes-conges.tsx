"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, CheckCircle, Clock, Plus, X } from "lucide-react";
import { CalendrierConges } from "@/components/conges/calendrier-conges";
import { libelleStatutConge, libelleTypeConge } from "@/components/conges/libelles-conges";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import {
  Dialogue,
  ContenuDialogue,
  EnteteDialogue,
  TitreDialogue,
} from "@/components/ui/dialog";
import { Etiquette } from "@/components/ui/label";
import { Entree } from "@/components/ui/input";
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
import { BarreRecherche } from "@/components/ui/barre-recherche";
import { FiltreSelect } from "@/components/ui/filtre-select";
import { Pagination } from "@/components/ui/pagination";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { useConges, useCreationDemandeConge } from "@/hooks/queries/use-conges";
import type { StatutDemandeConge, TypeConge } from "@/types";

function pastilleStatut(statut: StatutDemandeConge): NonNullable<PastilleProps["ton"]> {
  if (statut === "valide") return "succes";
  if (statut === "refuse" || statut === "annule") return "danger";
  if (statut === "en_attente") return "alerte";
  return "neutre";
}

const optionsStatut = [
  { valeur: "en_attente", libelle: "En attente" },
  { valeur: "valide", libelle: "Valide" },
  { valeur: "refuse", libelle: "Refuse" },
  { valeur: "annule", libelle: "Annule" },
];

const ELEMENTS_PAR_PAGE = 5;

export function VueMesConges({ impulsionFormulaire = 0 }: { impulsionFormulaire?: number }) {
  const { data: conges = [], isLoading } = useConges();
  const creation = useCreationDemandeConge();

  // Form states
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<TypeConge>("annuel");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [motif, setMotif] = useState("");

  // Filter states
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [jourFiltreCalendrier, setJourFiltreCalendrier] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const refSectionTableau = useRef<HTMLDivElement>(null);

  const selectionnerJourCalendrier = useCallback((jour: Date | null) => {
    setJourFiltreCalendrier(jour);
    if (jour) {
      requestAnimationFrame(() => {
        refSectionTableau.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  // Filter data
  const donneesFiltrees = useMemo(() => {
    return conges.filter((c) => {
      const correspondRecherche = 
        !recherche || 
        libelleTypeConge(c.type).toLowerCase().includes(recherche.toLowerCase()) ||
        (c.motif && c.motif.toLowerCase().includes(recherche.toLowerCase())) ||
        (c.commentaireRh && c.commentaireRh.toLowerCase().includes(recherche.toLowerCase()));
      const correspondStatut = !filtreStatut || c.statut === filtreStatut;
      let correspondJour = true;
      if (jourFiltreCalendrier) {
        try {
          correspondJour = isWithinInterval(jourFiltreCalendrier, {
            start: parseISO(c.dateDebut),
            end: parseISO(c.dateFin),
          });
        } catch {
          correspondJour = false;
        }
      }
      return correspondRecherche && correspondStatut && correspondJour;
    });
  }, [conges, recherche, filtreStatut, jourFiltreCalendrier]);

  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

  const statsResume = useMemo(() => {
    const enAttente = conges.filter((c) => c.statut === "en_attente").length;
    const validees = conges.filter((c) => c.statut === "valide").length;
    const refusees = conges.filter((c) => c.statut === "refuse").length;
    return { enAttente, validees, refusees };
  }, [conges]);

  // Reset page when filters change
  const handleRecherche = (val: string) => {
    setRecherche(val);
    setPage(1);
  };

  const handleFiltreStatut = (val: string) => {
    setFiltreStatut(val);
    setPage(1);
  };

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreStatut("");
    setJourFiltreCalendrier(null);
    setPage(1);
  };

  const filtresActifs = recherche || filtreStatut || jourFiltreCalendrier;

  const soumettre = async () => {
    await creation.mutateAsync({ type, dateDebut, dateFin, motif });
    setOuvert(false);
    setMotif("");
    setDateDebut("");
    setDateFin("");
    setType("annuel");
  };

  useEffect(() => {
    if (impulsionFormulaire <= 0) return;
    const id = window.setTimeout(() => setOuvert(true), 0);
    return () => window.clearTimeout(id);
  }, [impulsionFormulaire]);

  useEffect(() => {
    setPage(1);
  }, [jourFiltreCalendrier]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
            <CalendarDays className="size-6 text-[var(--accent-principal)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Mes conges</h2>
            <p className="text-sm text-[var(--texte-secondaire)]">
              {donneesFiltrees.length} demande{donneesFiltrees.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Bouton onClick={() => setOuvert(true)}>
          <Plus className="size-4" />
          Nouvelle demande
        </Bouton>
      </div>

      <div className="flex min-h-0 flex-col gap-4">
        <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--bordure)]/50 bg-[var(--surface-elevee)] px-4 py-3 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/12">
              <Clock className="size-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tabular-nums text-[var(--texte-principal)]">
                <NombreAnime valeur={statsResume.enAttente} />
              </p>
              <p className="text-xs text-[var(--texte-secondaire)]">En attente de traitement</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--bordure)]/50 bg-[var(--surface-elevee)] px-4 py-3 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/12">
              <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tabular-nums text-[var(--texte-principal)]">
                <NombreAnime valeur={statsResume.validees} />
              </p>
              <p className="text-xs text-[var(--texte-secondaire)]">Demandes validees</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--bordure)]/50 bg-[var(--surface-elevee)] px-4 py-3 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/12">
              <X className="size-5 text-red-600 dark:text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tabular-nums text-[var(--texte-principal)]">
                <NombreAnime valeur={statsResume.refusees} />
              </p>
              <p className="text-xs text-[var(--texte-secondaire)]">Demandes refusees</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3 sm:gap-4 xl:gap-6 xl:min-h-[min(32rem,70vh)] xl:flex-row xl:items-stretch">
        <div
          ref={refSectionTableau}
          className="flex min-h-0 min-w-0 flex-1 flex-col scroll-mt-20"
        >
        <Carte className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <CarteEntete className="shrink-0">
            <CarteTitre>Historique des demandes</CarteTitre>
            <CarteDescription>Suivi et statut de traitement par les RH.</CarteDescription>
          </CarteEntete>
          <CarteContenu className="!flex !min-h-0 flex-1 !flex-col !space-y-0 p-0">
            <div className="shrink-0 space-y-4 p-5 pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <BarreRecherche
                valeur={recherche}
                onChangerValeur={handleRecherche}
                placeholder="Rechercher..."
                className="w-full sm:max-w-xs"
              />
              <div className="flex flex-wrap items-center gap-2">
                <FiltreSelect
                  valeur={filtreStatut}
                  onChangerValeur={handleFiltreStatut}
                  options={optionsStatut}
                  placeholder="Tous les statuts"
                  label="Statut"
                  className="w-full sm:w-40"
                />
                {filtresActifs && (
                  <Bouton
                    variante="fantome"
                    taille="sm"
                    onClick={reinitialiserFiltres}
                    className="text-[var(--texte-secondaire)]"
                  >
                    <X className="size-4" />
                    Effacer
                  </Bouton>
                )}
              </div>
            </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-1">
            {isLoading ? (
              <div className="space-y-2">
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
              </div>
            ) : donneesPaginees.length === 0 ? (
              <div className="flex min-h-[12rem] flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="mb-3 size-12 text-[var(--texte-secondaire)]/40" />
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {filtresActifs ? "Aucune demande ne correspond aux filtres." : "Aucune demande de conge."}
                </p>
                {filtresActifs && (
                  <Bouton variante="secondaire" taille="sm" className="mt-3" onClick={reinitialiserFiltres}>
                    Effacer les filtres
                  </Bouton>
                )}
              </div>
            ) : (
              <Tableau>
                <TableauEntete className="sticky top-0 z-[1] bg-[var(--surface-mute)]/90 shadow-[0_1px_0_var(--bordure)] backdrop-blur-sm dark:bg-[var(--surface-mute)]/85">
                  <TableauRangee>
                    <TableauCelluleEntete>Type</TableauCelluleEntete>
                    <TableauCelluleEntete>Periode</TableauCelluleEntete>
                    <TableauCelluleEntete>Statut</TableauCelluleEntete>
                    <TableauCelluleEntete>Commentaire RH</TableauCelluleEntete>
                  </TableauRangee>
                </TableauEntete>
                <TableauCorps>
                  {donneesPaginees.map((d) => (
                    <TableauRangee key={d.id} className="group ligne-liste-luxe">
                      <TableauCellule className="font-medium">{libelleTypeConge(d.type)}</TableauCellule>
                      <TableauCellule className="whitespace-nowrap text-xs">
                        {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} →{" "}
                        {format(parseISO(d.dateFin), "d MMM yyyy", { locale: fr })}
                      </TableauCellule>
                      <TableauCellule>
                        <Pastille ton={pastilleStatut(d.statut)}>{libelleStatutConge(d.statut)}</Pastille>
                      </TableauCellule>
                      <TableauCellule className="max-w-xs text-xs text-[var(--texte-secondaire)]">
                        {d.commentaireRh?.trim() ? d.commentaireRh : "—"}
                      </TableauCellule>
                    </TableauRangee>
                  ))}
                </TableauCorps>
              </Tableau>
            )}
            </div>

            {donneesFiltrees.length > 0 && (
              <div className="shrink-0 border-t border-[var(--bordure)]/50 px-5 py-4">
                <Pagination
                  pageActuelle={page}
                  totalPages={Math.max(1, Math.ceil(donneesFiltrees.length / ELEMENTS_PAR_PAGE))}
                  onChangerPage={setPage}
                  nombreElementsTotal={donneesFiltrees.length}
                  taillePage={ELEMENTS_PAR_PAGE}
                />
              </div>
            )}
          </CarteContenu>
        </Carte>
        </div>

        <div className="flex min-h-0 w-full shrink-0 xl:w-[380px] xl:self-stretch">
          <CalendrierConges
            compact
            className="h-full min-h-0 w-full"
            demandes={conges}
            jourSelectionne={jourFiltreCalendrier}
            onSelectionnerJour={selectionnerJourCalendrier}
          />
        </div>
        </div>
      </div>

      {/* Dialog for new request */}
      <Dialogue open={ouvert} onOpenChange={setOuvert}>
        <ContenuDialogue>
          <EnteteDialogue>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                <CalendarDays className="size-5 text-[var(--accent-principal)]" />
              </div>
              <TitreDialogue>Nouvelle demande de conges</TitreDialogue>
            </div>
          </EnteteDialogue>
          <div className="grid gap-4 pt-2">
            <div className="space-y-2">
              <Etiquette>Type de conge</Etiquette>
              <select
                className="h-10 w-full rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm transition-colors focus:border-[var(--accent-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-principal)]/20"
                value={type}
                onChange={(e) => setType(e.target.value as TypeConge)}
              >
                {(["annuel", "sans_solde", "maladie", "maternite", "autre"] as TypeConge[]).map((t) => (
                  <option key={t} value={t}>
                    {libelleTypeConge(t)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Etiquette>Date de debut</Etiquette>
                <Entree type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Etiquette>Date de fin</Etiquette>
                <Entree type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Etiquette>Motif (optionnel)</Etiquette>
              <ZoneTexte 
                rows={3} 
                value={motif} 
                onChange={(e) => setMotif(e.target.value)} 
                placeholder="Precision sur votre demande..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Bouton variante="secondaire" type="button" onClick={() => setOuvert(false)}>
                Annuler
              </Bouton>
              <Bouton 
                type="button" 
                disabled={creation.isPending || !dateDebut || !dateFin} 
                onClick={() => void soumettre()}
              >
                {creation.isPending ? "Envoi..." : "Envoyer la demande"}
              </Bouton>
            </div>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </div>
  );
}
