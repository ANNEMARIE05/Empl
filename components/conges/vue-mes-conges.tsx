"use client";

import { useState, useMemo, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Filter, Plus, Search, X } from "lucide-react";
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

const optionsType = [
  { valeur: "annuel", libelle: "Annuel" },
  { valeur: "sans_solde", libelle: "Sans solde" },
  { valeur: "maladie", libelle: "Maladie" },
  { valeur: "maternite", libelle: "Maternite" },
  { valeur: "autre", libelle: "Autre" },
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
  const [filtreType, setFiltreType] = useState("");
  const [page, setPage] = useState(1);

  // Filter data
  const donneesFiltrees = useMemo(() => {
    return conges.filter((c) => {
      const correspondRecherche = 
        !recherche || 
        libelleTypeConge(c.type).toLowerCase().includes(recherche.toLowerCase()) ||
        (c.motif && c.motif.toLowerCase().includes(recherche.toLowerCase())) ||
        (c.commentaireRh && c.commentaireRh.toLowerCase().includes(recherche.toLowerCase()));
      const correspondStatut = !filtreStatut || c.statut === filtreStatut;
      const correspondType = !filtreType || c.type === filtreType;
      return correspondRecherche && correspondStatut && correspondType;
    });
  }, [conges, recherche, filtreStatut, filtreType]);

  const totalPages = Math.ceil(donneesFiltrees.length / ELEMENTS_PAR_PAGE);
  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

  // Reset page when filters change
  const handleRecherche = (val: string) => {
    setRecherche(val);
    setPage(1);
  };

  const handleFiltreStatut = (val: string) => {
    setFiltreStatut(val);
    setPage(1);
  };

  const handleFiltreType = (val: string) => {
    setFiltreType(val);
    setPage(1);
  };

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreStatut("");
    setFiltreType("");
    setPage(1);
  };

  const filtresActifs = recherche || filtreStatut || filtreType;

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

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Carte>
          <CarteEntete>
            <CarteTitre>Historique des demandes</CarteTitre>
            <CarteDescription>Suivi et statut de traitement par les RH.</CarteDescription>
          </CarteEntete>
          <CarteContenu className="space-y-4">
            {/* Filters */}
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
                <FiltreSelect
                  valeur={filtreType}
                  onChangerValeur={handleFiltreType}
                  options={optionsType}
                  placeholder="Tous les types"
                  label="Type"
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

            {isLoading ? (
              <div className="space-y-2">
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
              </div>
            ) : donneesPaginees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
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
                <TableauEntete>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--bordure)]/50">
                <p className="text-xs text-[var(--texte-secondaire)]">
                  Page {page} sur {totalPages} ({donneesFiltrees.length} resultat{donneesFiltrees.length > 1 ? "s" : ""})
                </p>
                <Pagination pageActuelle={page} totalPages={totalPages} onChangerPage={setPage} />
              </div>
            )}
          </CarteContenu>
        </Carte>

        <CalendrierConges demandes={conges} />
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
