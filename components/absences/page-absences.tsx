"use client";

import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarOff, Clock, CheckCircle, AlertCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
import { Bouton } from "@/components/ui/button";
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
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { magasinApplication } from "@/stores/magasin-application";

interface Absence {
  id: string;
  employe: string;
  employeId: string;
  motif: string;
  du: Date;
  au?: Date;
  statut: "Declare" | "Justifie" | "En validation";
}

// Mock data - in real app this would come from an API filtered by user
const toutesAbsences: Absence[] = [
  { id: "a1", employe: "Thomas Martin", employeId: "1", motif: "RTT", du: subDays(new Date(), 6), statut: "Declare" },
  { id: "a2", employe: "Karim Benali", employeId: "2", motif: "Arret maladie", du: subDays(new Date(), 18), au: subDays(new Date(), 15), statut: "Justifie" },
  { id: "a3", employe: "Lea Bernard", employeId: "3", motif: "Teletravail exceptionnel", du: subDays(new Date(), 2), statut: "En validation" },
  { id: "a4", employe: "Marie Dubois", employeId: "4", motif: "Conge annuel", du: subDays(new Date(), 10), au: subDays(new Date(), 5), statut: "Justifie" },
  { id: "a5", employe: "Pierre Durand", employeId: "5", motif: "RTT", du: subDays(new Date(), 4), statut: "Declare" },
  { id: "a6", employe: "Sophie Lambert", employeId: "6", motif: "Arret maladie", du: subDays(new Date(), 8), au: subDays(new Date(), 6), statut: "Justifie" },
  { id: "a7", employe: "Jean Moreau", employeId: "7", motif: "Formation", du: subDays(new Date(), 3), statut: "En validation" },
  { id: "a8", employe: "Claire Petit", employeId: "8", motif: "Conge sans solde", du: subDays(new Date(), 15), au: subDays(new Date(), 12), statut: "Declare" },
  { id: "a9", employe: "Lucas Garcia", employeId: "9", motif: "RTT", du: subDays(new Date(), 1), statut: "En validation" },
  { id: "a10", employe: "Emma Wilson", employeId: "10", motif: "Arret maladie", du: subDays(new Date(), 20), au: subDays(new Date(), 17), statut: "Justifie" },
  // Absences for demo user
  { id: "a11", employe: "Demo User", employeId: "demo-1", motif: "RTT", du: subDays(new Date(), 14), statut: "Justifie" },
  { id: "a12", employe: "Demo User", employeId: "demo-1", motif: "Teletravail exceptionnel", du: subDays(new Date(), 7), statut: "Declare" },
  { id: "a13", employe: "Demo User", employeId: "demo-1", motif: "Formation", du: subDays(new Date(), 21), au: subDays(new Date(), 20), statut: "Justifie" },
  { id: "a14", employe: "Demo User", employeId: "demo-1", motif: "Arret maladie", du: subDays(new Date(), 30), au: subDays(new Date(), 28), statut: "En validation" },
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
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreMotif, setFiltreMotif] = useState("");
  const [page, setPage] = useState(1);

  // Filter to show only current user's absences
  const mesAbsences = useMemo(() => {
    if (!utilisateur) return [];
    // For demo purposes, show absences where employeId matches or for demo user
    return toutesAbsences.filter((a) => 
      a.employeId === utilisateur.id || 
      a.employeId === "demo-1" // Demo user fallback
    );
  }, [utilisateur]);

  // Stats for current user
  const stats = useMemo(() => {
    const declares = mesAbsences.filter((a) => a.statut === "Declare").length;
    const justifies = mesAbsences.filter((a) => a.statut === "Justifie").length;
    const enValidation = mesAbsences.filter((a) => a.statut === "En validation").length;
    return { declares, justifies, enValidation, total: mesAbsences.length };
  }, [mesAbsences]);

  const donneesFiltrees = useMemo(() => {
    return mesAbsences.filter((l) => {
      const correspondRecherche =
        l.motif.toLowerCase().includes(recherche.toLowerCase());
      const correspondStatut = !filtreStatut || l.statut === filtreStatut;
      const correspondMotif = !filtreMotif || l.motif === filtreMotif;
      return correspondRecherche && correspondStatut && correspondMotif;
    });
  }, [mesAbsences, recherche, filtreStatut, filtreMotif]);

  const totalPages = Math.ceil(donneesFiltrees.length / ELEMENTS_PAR_PAGE);
  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

  const handleChangerPage = (nouvellePage: number) => {
    setPage(nouvellePage);
  };

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

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreStatut("");
    setFiltreMotif("");
    setPage(1);
  };

  const filtresActifs = recherche || filtreStatut || filtreMotif;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
          <CalendarOff className="size-6 text-[var(--accent-principal)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Mes absences</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">
            Historique de vos indisponibilites
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                <CalendarOff className="size-6 text-[var(--accent-principal)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--accent-principal)]">
                  <NombreAnime valeur={stats.total} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Total absences</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15">
                <Clock className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  <NombreAnime valeur={stats.declares} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Declarees</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15">
                <CheckCircle className="size-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  <NombreAnime valeur={stats.justifies} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Justifiees</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15">
                <AlertCircle className="size-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  <NombreAnime valeur={stats.enValidation} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">En validation</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Historique des absences</CarteTitre>
          <CarteDescription>Vos absences declarees et leur statut de justification.</CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de filtres et recherche */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={handleRecherche}
              placeholder="Rechercher un motif..."
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap items-center gap-2">
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

          {/* Tableau */}
          {donneesPaginees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarOff className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">
                {filtresActifs ? "Aucune absence ne correspond aux filtres." : "Aucune absence enregistree."}
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
                  <TableauCelluleEntete>Motif</TableauCelluleEntete>
                  <TableauCelluleEntete>Periode</TableauCelluleEntete>
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {donneesPaginees.map((l) => (
                  <TableauRangee key={l.id} className="group ligne-liste-luxe">
                    <TableauCellule className="font-medium">{l.motif}</TableauCellule>
                    <TableauCellule className="text-xs">
                      {format(l.du, "d MMMM yyyy", { locale: fr })}
                      {l.au && (
                        <span className="text-[var(--texte-secondaire)]">
                          {" → "}{format(l.au, "d MMMM yyyy", { locale: fr })}
                        </span>
                      )}
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
