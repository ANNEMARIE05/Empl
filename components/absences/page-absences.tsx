"use client";

import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarOff } from "lucide-react";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
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

interface Absence {
  id: string;
  employe: string;
  motif: string;
  du: Date;
  statut: "Declare" | "Justifie" | "En validation";
}

const lignesMock: Absence[] = [
  { id: "a1", employe: "Thomas Martin", motif: "RTT", du: subDays(new Date(), 6), statut: "Declare" },
  { id: "a2", employe: "Karim Benali", motif: "Arret maladie", du: subDays(new Date(), 18), statut: "Justifie" },
  { id: "a3", employe: "Lea Bernard", motif: "Teletravail exceptionnel", du: subDays(new Date(), 2), statut: "En validation" },
  { id: "a4", employe: "Marie Dubois", motif: "Conge annuel", du: subDays(new Date(), 10), statut: "Justifie" },
  { id: "a5", employe: "Pierre Durand", motif: "RTT", du: subDays(new Date(), 4), statut: "Declare" },
  { id: "a6", employe: "Sophie Lambert", motif: "Arret maladie", du: subDays(new Date(), 8), statut: "Justifie" },
  { id: "a7", employe: "Jean Moreau", motif: "Formation", du: subDays(new Date(), 3), statut: "En validation" },
  { id: "a8", employe: "Claire Petit", motif: "Conge sans solde", du: subDays(new Date(), 15), statut: "Declare" },
  { id: "a9", employe: "Lucas Garcia", motif: "RTT", du: subDays(new Date(), 1), statut: "En validation" },
  { id: "a10", employe: "Emma Wilson", motif: "Arret maladie", du: subDays(new Date(), 20), statut: "Justifie" },
];

const optionsStatut = [
  { valeur: "Declare", libelle: "Declare" },
  { valeur: "Justifie", libelle: "Justifie" },
  { valeur: "En validation", libelle: "En validation" },
];

const optionsMotif = [
  { valeur: "RTT", libelle: "RTT" },
  { valeur: "Arret maladie", libelle: "Arret maladie" },
  { valeur: "Teletravail exceptionnel", libelle: "Teletravail exceptionnel" },
  { valeur: "Conge annuel", libelle: "Conge annuel" },
  { valeur: "Conge sans solde", libelle: "Conge sans solde" },
  { valeur: "Formation", libelle: "Formation" },
];

const ELEMENTS_PAR_PAGE = 5;

export function PageAbsences() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreMotif, setFiltreMotif] = useState("");
  const [page, setPage] = useState(1);

  const donneesFiltrees = useMemo(() => {
    return lignesMock.filter((l) => {
      const correspondRecherche =
        l.employe.toLowerCase().includes(recherche.toLowerCase()) ||
        l.motif.toLowerCase().includes(recherche.toLowerCase());
      const correspondStatut = !filtreStatut || l.statut === filtreStatut;
      const correspondMotif = !filtreMotif || l.motif === filtreMotif;
      return correspondRecherche && correspondStatut && correspondMotif;
    });
  }, [recherche, filtreStatut, filtreMotif]);

  const totalPages = Math.ceil(donneesFiltrees.length / ELEMENTS_PAR_PAGE);
  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

  const handleChangerPage = (nouvellePage: number) => {
    setPage(nouvellePage);
  };

  // Reset page when filters change
  const handleFiltreStatut = (val: string) => {
    setFiltreStatut(val);
    setPage(1);
  };

  const handleFiltreMotif = (val: string) => {
    setFiltreMotif(val);
    setPage(1);
  };

  const handleRecherche = (val: string) => {
    setRecherche(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
          <CalendarOff className="size-6 text-[var(--accent-principal)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Absences & indisponibilites</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">
            {donneesFiltrees.length} absence{donneesFiltrees.length > 1 ? "s" : ""} enregistree{donneesFiltrees.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Suivi des absences</CarteTitre>
          <CarteDescription>Donnees de demonstration - integration future avec la pointeuse / paie.</CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de filtres et recherche */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={handleRecherche}
              placeholder="Rechercher un employe ou motif..."
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <FiltreSelect
                valeur={filtreStatut}
                onChangerValeur={handleFiltreStatut}
                options={optionsStatut}
                placeholder="Tous les statuts"
                label="Filtrer par statut"
                className="w-full sm:w-44"
              />
              <FiltreSelect
                valeur={filtreMotif}
                onChangerValeur={handleFiltreMotif}
                options={optionsMotif}
                placeholder="Tous les motifs"
                label="Filtrer par motif"
                className="w-full sm:w-48"
              />
            </div>
          </div>

          {/* Tableau */}
          {donneesPaginees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarOff className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">Aucune absence trouvee.</p>
            </div>
          ) : (
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete>Collaborateur</TableauCelluleEntete>
                  <TableauCelluleEntete>Motif</TableauCelluleEntete>
                  <TableauCelluleEntete>Depuis</TableauCelluleEntete>
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {donneesPaginees.map((l) => (
                  <TableauRangee key={l.id} className="group ligne-liste-luxe">
                    <TableauCellule className="font-medium">{l.employe}</TableauCellule>
                    <TableauCellule>{l.motif}</TableauCellule>
                    <TableauCellule className="text-xs">
                      {format(l.du, "d MMMM yyyy", { locale: fr })}
                    </TableauCellule>
                    <TableauCellule>
                      <Pastille
                        ton={
                          l.statut === "Justifie"
                            ? "succes"
                            : l.statut === "En validation"
                            ? "alerte"
                            : "neutre"
                        }
                      >
                        {l.statut}
                      </Pastille>
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
              <Pagination
                pageActuelle={page}
                totalPages={totalPages}
                onChangerPage={handleChangerPage}
              />
            </div>
          )}
        </CarteContenu>
      </Carte>
    </div>
  );
}
