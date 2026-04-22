"use client";

import { useState, useMemo, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Plus, Search, X } from "lucide-react";
import { libelleStatutDocument, libelleTypeDocument } from "@/components/documents/libelles-documents";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import {
  Dialogue,
  ContenuDialogue,
  EnteteDialogue,
  TitreDialogue,
} from "@/components/ui/dialog";
import { Etiquette } from "@/components/ui/label";
import { ZoneTexte } from "@/components/ui/textarea";
import { Pastille } from "@/components/ui/badge";
import { Squelette } from "@/components/ui/skeleton";
import {
  Tableau,
  TableauCellule,
  TableauCelluleEntete,
  TableauCorps,
  TableauEntete,
  TableauRangee,
} from "@/components/ui/table";
import { BarreRecherche } from "@/components/ui/barre-recherche";
import { FiltreSelect } from "@/components/ui/filtre-select";
import { Pagination } from "@/components/ui/pagination";
import { useCreationDemandeDocument, useDocuments } from "@/hooks/queries/use-documents";
import type { StatutDemandeDocument, TypeDocument } from "@/types";

function tonStatut(s: StatutDemandeDocument) {
  if (s === "pret") return "succes";
  if (s === "refuse") return "danger";
  return "alerte";
}

const optionsStatut = [
  { valeur: "en_attente", libelle: "En attente" },
  { valeur: "en_traitement", libelle: "En traitement" },
  { valeur: "pret", libelle: "Pret" },
  { valeur: "refuse", libelle: "Refuse" },
];

const optionsType = [
  { valeur: "attestation_salaire", libelle: "Attestation salaire" },
  { valeur: "certificat_travail", libelle: "Certificat travail" },
  { valeur: "rib", libelle: "RIB" },
  { valeur: "convention_stage", libelle: "Convention stage" },
  { valeur: "autre", libelle: "Autre" },
];

const ELEMENTS_PAR_PAGE = 5;

export function VueMesDocuments({ impulsionFormulaire = 0 }: { impulsionFormulaire?: number }) {
  const { data: documents = [], isLoading } = useDocuments();
  const creation = useCreationDemandeDocument();
  
  // Form states
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<TypeDocument>("attestation_salaire");
  const [commentaireEmploye, setCommentaireEmploye] = useState("");

  // Filter states
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreType, setFiltreType] = useState("");
  const [page, setPage] = useState(1);

  // Filter data
  const donneesFiltrees = useMemo(() => {
    return documents.filter((d) => {
      const correspondRecherche = 
        !recherche || 
        libelleTypeDocument(d.type).toLowerCase().includes(recherche.toLowerCase()) ||
        (d.commentaireRh && d.commentaireRh.toLowerCase().includes(recherche.toLowerCase())) ||
        (d.commentaireEmploye && d.commentaireEmploye.toLowerCase().includes(recherche.toLowerCase()));
      const correspondStatut = !filtreStatut || d.statut === filtreStatut;
      const correspondType = !filtreType || d.type === filtreType;
      return correspondRecherche && correspondStatut && correspondType;
    });
  }, [documents, recherche, filtreStatut, filtreType]);

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

  const envoyer = async () => {
    await creation.mutateAsync({ type, commentaireEmploye });
    setOuvert(false);
    setCommentaireEmploye("");
    setType("attestation_salaire");
  };

  useEffect(() => {
    if (impulsionFormulaire <= 0) return;
    const id = window.setTimeout(() => setOuvert(true), 0);
    return () => window.clearTimeout(id);
  }, [impulsionFormulaire]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15">
            <FileText className="size-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Mes documents</h2>
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

      <Carte>
        <CarteEntete>
          <CarteTitre>Historique des demandes</CarteTitre>
          <CarteDescription>Suivi des pieces demandees aux RH.</CarteDescription>
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
                className="w-full sm:w-48"
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
              <FileText className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">
                {filtresActifs ? "Aucune demande ne correspond aux filtres." : "Aucune demande de document."}
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
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                  <TableauCelluleEntete>Commentaire RH</TableauCelluleEntete>
                  <TableauCelluleEntete>Creee le</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {donneesPaginees.map((d) => (
                  <TableauRangee key={d.id} className="group ligne-liste-luxe">
                    <TableauCellule className="font-medium">{libelleTypeDocument(d.type)}</TableauCellule>
                    <TableauCellule>
                      <Pastille ton={tonStatut(d.statut)}>{libelleStatutDocument(d.statut)}</Pastille>
                    </TableauCellule>
                    <TableauCellule className="max-w-md text-xs text-[var(--texte-secondaire)]">
                      {d.commentaireRh?.trim() ? d.commentaireRh : "—"}
                    </TableauCellule>
                    <TableauCellule className="whitespace-nowrap text-xs">
                      {format(parseISO(d.creeLe), "d MMM yyyy", { locale: fr })}
                    </TableauCellule>
                  </TableauRangee>
                ))}
              </TableauCorps>
            </Tableau>
          )}

          {/* Pagination */}
          {donneesFiltrees.length > 0 && (
            <div className="border-t border-[var(--bordure)]/50 pt-4">
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

      {/* Dialog for new request */}
      <Dialogue open={ouvert} onOpenChange={setOuvert}>
        <ContenuDialogue>
          <EnteteDialogue>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                <FileText className="size-5 text-emerald-600" />
              </div>
              <TitreDialogue>Nouvelle demande de document</TitreDialogue>
            </div>
          </EnteteDialogue>
          <div className="grid gap-4 pt-2">
            <div className="space-y-2">
              <Etiquette>Type de document</Etiquette>
              <select
                className="h-10 w-full rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm transition-colors focus:border-[var(--accent-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-principal)]/20"
                value={type}
                onChange={(e) => setType(e.target.value as TypeDocument)}
              >
                {(
                  [
                    "attestation_salaire",
                    "certificat_travail",
                    "rib",
                    "convention_stage",
                    "autre",
                  ] as TypeDocument[]
                ).map((t) => (
                  <option key={t} value={t}>
                    {libelleTypeDocument(t)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Etiquette>Precisions (optionnel)</Etiquette>
              <ZoneTexte 
                rows={3} 
                value={commentaireEmploye} 
                onChange={(e) => setCommentaireEmploye(e.target.value)}
                placeholder="Informations complementaires pour votre demande..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Bouton variante="secondaire" type="button" onClick={() => setOuvert(false)}>
                Annuler
              </Bouton>
              <Bouton type="button" disabled={creation.isPending} onClick={() => void envoyer()}>
                {creation.isPending ? "Envoi..." : "Envoyer la demande"}
              </Bouton>
            </div>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </div>
  );
}
