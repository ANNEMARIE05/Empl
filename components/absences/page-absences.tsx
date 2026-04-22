"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarOff, CheckCircle, AlertCircle, Plus, X, Check, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
import { Bouton } from "@/components/ui/button";
import {
  Dialogue,
  ContenuDialogue,
  EnteteDialogue,
  TitreDialogue,
} from "@/components/ui/dialog";
import { Etiquette } from "@/components/ui/label";
import { Entree } from "@/components/ui/input";
import { ZoneTexte } from "@/components/ui/textarea";
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
import { GrilleStatsKpi } from "@/components/ui/grille-stats-kpi";
import { magasinApplication } from "@/stores/magasin-application";
import { cn } from "@/lib/utils";
import {
  type StatutAbsence,
  type AbsenceDemo,
  creerAbsencesDemo,
  libelleStatutAbsence,
} from "@/lib/donnees-absences-demo";

type Absence = AbsenceDemo;

const optionsStatut: { valeur: string; libelle: string }[] = [
  { valeur: "justifiee", libelle: "Justifiées" },
  { valeur: "refusee", libelle: "Refusées" },
  { valeur: "en_attente", libelle: "En attente" },
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

export function PageAbsences({ impulsionFormulaire = 0 }: { impulsionFormulaire?: number }) {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const toutesAbsences = useMemo(() => creerAbsencesDemo(), []);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreMotif, setFiltreMotif] = useState("");
  const [page, setPage] = useState(1);
  const [absencesLocales, setAbsencesLocales] = useState<Absence[]>([]);
  /** Décisions RH (mock) : mise à jour du statut d’une demande. */
  const [statutAbsenceParId, setStatutAbsenceParId] = useState<Record<string, StatutAbsence>>({});
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [texteMotif, setTexteMotif] = useState("");
  const [dateDu, setDateDu] = useState("");
  const [dateAu, setDateAu] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const vueTouteEntreprise = utilisateur?.role === "rh";

  const absencesVisibles = useMemo(() => {
    if (!utilisateur) return [];
    const appliquer = (a: Absence): Absence => {
      const s = statutAbsenceParId[a.id];
      return s ? { ...a, statut: s } : a;
    };
    if (vueTouteEntreprise) return toutesAbsences.map(appliquer);
    const deBase = toutesAbsences.filter((a) => a.employeId === utilisateur.id).map(appliquer);
    return [...absencesLocales.map(appliquer), ...deBase];
  }, [utilisateur, vueTouteEntreprise, absencesLocales, statutAbsenceParId, toutesAbsences]);

  const stats = useMemo(() => {
    const justifies = absencesVisibles.filter((a) => a.statut === "justifiee").length;
    const enAttente = absencesVisibles.filter((a) => a.statut === "en_attente").length;
    const refus = absencesVisibles.filter((a) => a.statut === "refusee").length;
    return { justifies, enAttente, refus, total: absencesVisibles.length };
  }, [absencesVisibles]);

  const donneesFiltrees = useMemo(() => {
    const q = recherche.toLowerCase();
    return absencesVisibles.filter((l) => {
      const correspondRecherche =
        l.motif.toLowerCase().includes(q) ||
        (vueTouteEntreprise && l.employe.toLowerCase().includes(q));
      const correspondStatut = !filtreStatut || l.statut === filtreStatut;
      const correspondMotif = !filtreMotif || l.motif === filtreMotif;
      return correspondRecherche && correspondStatut && correspondMotif;
    });
  }, [absencesVisibles, recherche, filtreStatut, filtreMotif, vueTouteEntreprise]);

  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

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

  const majStatutAbsenceRh = (id: string, statut: StatutAbsence) => {
    setStatutAbsenceParId((p) => ({ ...p, [id]: statut }));
  };

  const filtresActifs = recherche || filtreStatut || filtreMotif;

  const soumettreDemande = async () => {
    const motif = texteMotif.trim();
    if (!utilisateur || !dateDu || !motif) return;
    setEnvoiEnCours(true);
    const nouvelle: Absence = {
      id: `local-${Date.now()}`,
      employe: `${utilisateur.prenom} ${utilisateur.nom}`,
      employeId: utilisateur.id,
      motif,
      du: new Date(dateDu),
      au: dateAu ? new Date(dateAu) : undefined,
      statut: "en_attente",
    };
    await new Promise((r) => window.setTimeout(r, 400));
    setAbsencesLocales((prev) => [nouvelle, ...prev]);
    setEnvoiEnCours(false);
    setDialogueOuvert(false);
    setDateDu("");
    setDateAu("");
    setTexteMotif("");
    setPage(1);
  };

  useEffect(() => {
    if (impulsionFormulaire <= 0) return;
    const id = window.setTimeout(() => setDialogueOuvert(true), 0);
    return () => window.clearTimeout(id);
  }, [impulsionFormulaire]);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15 sm:size-12 sm:rounded-2xl">
            <CalendarOff className="size-5 text-[var(--accent-principal)] sm:size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight sm:text-xl">
              {vueTouteEntreprise ? "Absences" : "Mes absences"}
            </h2>
            <p className="text-xs text-[var(--texte-secondaire)] sm:text-sm">
              {vueTouteEntreprise
                ? "Traitement des indisponibilites declarees par les collaborateurs"
                : "Historique de vos indisponibilites"}
            </p>
          </div>
        </div>
        {!vueTouteEntreprise && (
          <Bouton onClick={() => setDialogueOuvert(true)}>
            <Plus className="size-4" />
            Nouvelle demande
          </Bouton>
        )}
      </div>

      {/* Stats cards : 2×2 sur mobile, 2 colonnes sm–md, 4 colonnes large */}
      <GrilleStatsKpi colonnes={4}>
        <motion.div
          className="min-w-0"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full min-w-0">
            <CarteContenu className="flex flex-col items-center gap-1 py-2 text-center sm:flex-row sm:items-center sm:gap-2.5 sm:py-2.5 sm:text-left md:gap-4 md:py-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent-principal)]/15 sm:size-10 sm:rounded-lg md:size-12 md:rounded-xl">
                <CalendarOff className="size-4 text-[var(--accent-principal)] sm:size-5 md:size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tabular-nums text-[var(--accent-principal)] sm:text-lg md:text-2xl">
                  <NombreAnime valeur={stats.total} />
                </p>
                <p className="text-[10px] text-[var(--texte-secondaire)] sm:text-xs md:text-sm">Total</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full min-w-0">
            <CarteContenu className="flex flex-col items-center gap-1 py-2 text-center sm:flex-row sm:items-center sm:gap-2.5 sm:py-2.5 sm:text-left md:gap-4 md:py-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15 sm:size-10 sm:rounded-lg md:size-12 md:rounded-xl">
                <AlertCircle className="size-4 text-amber-600 sm:size-5 md:size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tabular-nums text-amber-600 sm:text-lg md:text-2xl">
                  <NombreAnime valeur={stats.enAttente} />
                </p>
                <p className="text-[10px] text-[var(--texte-secondaire)] sm:text-xs md:text-sm">En attente</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full min-w-0">
            <CarteContenu className="flex flex-col items-center gap-1 py-2 text-center sm:flex-row sm:items-center sm:gap-2.5 sm:py-2.5 sm:text-left md:gap-4 md:py-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 sm:size-10 sm:rounded-lg md:size-12 md:rounded-xl">
                <CheckCircle className="size-4 text-emerald-600 sm:size-5 md:size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tabular-nums text-emerald-600 sm:text-lg md:text-2xl">
                  <NombreAnime valeur={stats.justifies} />
                </p>
                <p className="text-[10px] text-[var(--texte-secondaire)] sm:text-xs md:text-sm">Justifiées</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full min-w-0">
            <CarteContenu className="flex flex-col items-center gap-1 py-2 text-center sm:flex-row sm:items-center sm:gap-2.5 sm:py-2.5 sm:text-left md:gap-4 md:py-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--danger)]/15 sm:size-10 sm:rounded-lg md:size-12 md:rounded-xl">
                <Ban className="size-4 text-[var(--danger)] sm:size-5 md:size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tabular-nums text-[var(--danger)] sm:text-lg md:text-2xl">
                  <NombreAnime valeur={stats.refus} />
                </p>
                <p className="text-[10px] text-[var(--texte-secondaire)] sm:text-xs md:text-sm">Refusées</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>
      </GrilleStatsKpi>

      <Carte>
        <CarteEntete>
          <CarteTitre>Historique des absences</CarteTitre>
          <CarteDescription>
            {vueTouteEntreprise
              ? "Validez ou refusez les demandes en attente ; le collaborateur voit le statut mis a jour."
              : "Vos absences déclarées et leur statut (en attente, justifiée ou refusée)."}
          </CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de filtres et recherche */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={handleRecherche}
              placeholder={
                vueTouteEntreprise ? "Motif ou collaborateur…" : "Rechercher un motif…"
              }
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
                  {vueTouteEntreprise && (
                    <TableauCelluleEntete>Demandeur</TableauCelluleEntete>
                  )}
                  <TableauCelluleEntete>Motif</TableauCelluleEntete>
                  <TableauCelluleEntete>Periode</TableauCelluleEntete>
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                  {vueTouteEntreprise && (
                    <TableauCelluleEntete className="text-right">Actions</TableauCelluleEntete>
                  )}
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {donneesPaginees.map((l) => (
                  <TableauRangee key={l.id} className="group ligne-liste-luxe">
                    {vueTouteEntreprise && (
                      <TableauCellule className="text-sm text-[var(--texte-secondaire)]">
                        {l.employe}
                      </TableauCellule>
                    )}
                    <TableauCellule
                      className={cn(
                        "font-medium break-words",
                        vueTouteEntreprise && "whitespace-pre-wrap",
                      )}
                    >
                      {l.motif}
                    </TableauCellule>
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
                          l.statut === "justifiee"
                            ? "succes"
                            : l.statut === "en_attente"
                            ? "alerte"
                            : "danger"
                        }
                      >
                        {libelleStatutAbsence(l.statut)}
                      </Pastille>
                    </TableauCellule>
                    {vueTouteEntreprise && (
                      <TableauCellule className="text-right">
                        {l.statut === "en_attente" ? (
                          <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                            <Bouton
                              type="button"
                              taille="sm"
                              onClick={() => majStatutAbsenceRh(l.id, "justifiee")}
                            >
                              <Check className="size-3.5" />
                              Accepter
                            </Bouton>
                            <Bouton
                              type="button"
                              taille="sm"
                              variante="secondaire"
                              onClick={() => majStatutAbsenceRh(l.id, "refusee")}
                            >
                              <Ban className="size-3.5" />
                              Refuser
                            </Bouton>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--texte-secondaire)]/70">—</span>
                        )}
                      </TableauCellule>
                    )}
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

      {!vueTouteEntreprise && (
        <Dialogue open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
          <ContenuDialogue>
            <EnteteDialogue>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                  <CalendarOff className="size-5 text-[var(--accent-principal)]" />
                </div>
                <TitreDialogue>Demande d&apos;absence</TitreDialogue>
              </div>
            </EnteteDialogue>
            <div className="grid gap-2.5 sm:gap-4 pt-1.5 sm:pt-2">
              <div className="space-y-2">
                <Etiquette htmlFor="demande-absence-motif">Motif de la demande</Etiquette>
                <ZoneTexte
                  id="demande-absence-motif"
                  value={texteMotif}
                  onChange={(e) => setTexteMotif(e.target.value)}
                  placeholder="Décrivez le motif de votre absence…"
                  rows={4}
                />
              </div>
              <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Etiquette>Date de debut</Etiquette>
                  <Entree type="date" value={dateDu} onChange={(e) => setDateDu(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Etiquette>Date de fin (optionnel)</Etiquette>
                  <Entree type="date" value={dateAu} onChange={(e) => setDateAu(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Bouton variante="secondaire" type="button" onClick={() => setDialogueOuvert(false)}>
                  Annuler
                </Bouton>
                <Bouton
                  type="button"
                  disabled={envoiEnCours || !dateDu || !texteMotif.trim()}
                  onClick={() => void soumettreDemande()}
                >
                  {envoiEnCours ? "Envoi..." : "Envoyer la demande"}
                </Bouton>
              </div>
            </div>
          </ContenuDialogue>
        </Dialogue>
      )}
    </div>
  );
}
