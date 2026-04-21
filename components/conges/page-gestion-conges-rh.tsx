"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Save, Search, X, Filter, LayoutGrid, LayoutList } from "lucide-react";
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

const ITEMS_PAR_PAGE = 5;

function pastilleStatut(statut: StatutDemandeConge): NonNullable<PastilleProps["ton"]> {
  if (statut === "valide") return "succes";
  if (statut === "refuse" || statut === "annule") return "danger";
  if (statut === "en_attente") return "alerte";
  return "neutre";
}

export function PageGestionCongesRh() {
  const { data: conges = [], isLoading } = useConges();
  const { data: employes = [] } = useEmployes();
  const mutation = useMiseAJourCongeRh();
  const [ligneOuverte, setLigneOuverte] = useState<string | null>(null);
  const [brouillons, setBrouillons] = useState<
    Record<string, { commentaireRh: string; noteInterneRh: string; statut: StatutDemandeConge }>
  >({});

  // Filtres et recherche
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutDemandeConge | "tous">("tous");
  const [filtreType, setFiltreType] = useState<TypeConge | "tous">("tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [vueMode, setVueMode] = useState<"tableau" | "grille">("tableau");

  const parEmploye = useMemo(() => {
    const map = new Map<string, string>();
    employes.forEach((e) => map.set(e.id, `${e.prenom} ${e.nom}`));
    return map;
  }, [employes]);

  // Filtrage des conges
  const congesFiltres = useMemo(() => {
    return conges.filter((d) => {
      const nomEmploye = parEmploye.get(d.employeId)?.toLowerCase() ?? "";
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

  const ouvrirOuBasculer = (id: string, d: DemandeConge) => {
    setLigneOuverte((c) => (c === id ? null : id));
    setBrouillons((prev) => ({
      ...prev,
      [id]: prev[id] ?? {
        commentaireRh: d.commentaireRh ?? "",
        noteInterneRh: d.noteInterneRh ?? "",
        statut: d.statut,
      },
    }));
  };

  const enregistrer = async (id: string) => {
    const b = brouillons[id];
    if (!b) return;
    await mutation.mutateAsync({
      id,
      commentaireRh: b.commentaireRh,
      noteInterneRh: b.noteInterneRh,
      statut: b.statut,
    });
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Carte className="animate-shimmer">
          <CarteEntete>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CarteTitre>File des demandes</CarteTitre>
                <CarteDescription>
                  {congesFiltres.length} demande{congesFiltres.length > 1 ? "s" : ""} trouvee{congesFiltres.length > 1 ? "s" : ""}
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
                  placeholder="Rechercher par employe, type, motif..."
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
              <div className="space-y-2">
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
              </div>
            ) : vueMode === "tableau" ? (
              <Tableau>
                <TableauEntete>
                  <TableauRangee>
                    <TableauCelluleEntete className="w-8" />
                    <TableauCelluleEntete>Employe</TableauCelluleEntete>
                    <TableauCelluleEntete>Type</TableauCelluleEntete>
                    <TableauCelluleEntete>Periode</TableauCelluleEntete>
                    <TableauCelluleEntete>Statut</TableauCelluleEntete>
                    <TableauCelluleEntete>Commentaire</TableauCelluleEntete>
                  </TableauRangee>
                </TableauEntete>
                <TableauCorps>
                  {congesPagines.length === 0 ? (
                    <TableauRangee>
                      <TableauCellule colSpan={6} className="py-8 text-center text-[var(--texte-secondaire)]">
                        Aucune demande trouvee
                      </TableauCellule>
                    </TableauRangee>
                  ) : (
                    congesPagines.map((d) => {
                      const ouvert = ligneOuverte === d.id;
                      const b = brouillons[d.id];
                      return (
                        <React.Fragment key={d.id}>
                          <TableauRangee
                            className="ligne-liste-luxe cursor-pointer"
                            onClick={() => ouvrirOuBasculer(d.id, d)}
                          >
                            <TableauCellule>
                              {ouvert ? (
                                <ChevronDown className="size-4 text-[var(--texte-secondaire)]" />
                              ) : (
                                <ChevronRight className="size-4 text-[var(--texte-secondaire)]" />
                              )}
                            </TableauCellule>
                            <TableauCellule className="font-medium">
                              {parEmploye.get(d.employeId) ?? d.employeId}
                            </TableauCellule>
                            <TableauCellule>{libelleTypeConge(d.type)}</TableauCellule>
                            <TableauCellule className="whitespace-nowrap text-xs">
                              {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} →{" "}
                              {format(parseISO(d.dateFin), "d MMM yyyy", { locale: fr })}
                            </TableauCellule>
                            <TableauCellule>
                              <Pastille ton={pastilleStatut(d.statut)}>{libelleStatutConge(d.statut)}</Pastille>
                            </TableauCellule>
                            <TableauCellule className="max-w-[220px] truncate text-xs text-[var(--texte-secondaire)]">
                              {d.commentaireRh || "—"}
                            </TableauCellule>
                          </TableauRangee>
                          {ouvert && b ? (
                            <TableauRangee>
                              <TableauCellule colSpan={6} className="bg-[var(--surface-mute)]/40 p-4">
                                <motion.div
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="grid gap-4 md:grid-cols-2"
                                >
                                  <div className="space-y-2">
                                    <Etiquette>Commentaire RH (partage / dossier)</Etiquette>
                                    <ZoneTexte
                                      rows={4}
                                      value={b.commentaireRh}
                                      onChange={(e) =>
                                        setBrouillons((prev) => ({
                                          ...prev,
                                          [d.id]: { ...b, commentaireRh: e.target.value },
                                        }))
                                      }
                                      placeholder="Message transmis a l'employe ou consigne au dossier..."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Etiquette>Note interne RH</Etiquette>
                                    <ZoneTexte
                                      rows={4}
                                      value={b.noteInterneRh}
                                      onChange={(e) =>
                                        setBrouillons((prev) => ({
                                          ...prev,
                                          [d.id]: { ...b, noteInterneRh: e.target.value },
                                        }))
                                      }
                                      placeholder="Memo interne : contexte manager, risque couverture..."
                                    />
                                    <div className="space-y-2">
                                      <Etiquette>Statut</Etiquette>
                                      <select
                                        className="h-9 w-full rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-2 text-sm"
                                        value={b.statut}
                                        onChange={(e) =>
                                          setBrouillons((prev) => ({
                                            ...prev,
                                            [d.id]: { ...b, statut: e.target.value as StatutDemandeConge },
                                          }))
                                        }
                                      >
                                        {(
                                          ["en_attente", "valide", "refuse", "annule"] as StatutDemandeConge[]
                                        ).map((s) => (
                                          <option key={s} value={s}>
                                            {libelleStatutConge(s)}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <Bouton
                                      type="button"
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        void enregistrer(d.id);
                                      }}
                                      disabled={mutation.isPending}
                                      className="w-full md:w-auto"
                                    >
                                      <Save className="size-4" />
                                      Enregistrer le traitement
                                    </Bouton>
                                  </div>
                                </motion.div>
                              </TableauCellule>
                            </TableauRangee>
                          ) : null}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableauCorps>
              </Tableau>
            ) : (
              /* Vue Grille */
              <div className="grid gap-4 sm:grid-cols-2">
                {congesPagines.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-[var(--texte-secondaire)]">
                    Aucune demande trouvee
                  </div>
                ) : (
                  congesPagines.map((d) => {
                    const ouvert = ligneOuverte === d.id;
                    const b = brouillons[d.id];
                    return (
                      <motion.div
                        key={d.id}
                        layout
                        className="rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] p-4 transition-shadow hover:shadow-md"
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => ouvrirOuBasculer(d.id, d)}
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-[var(--texte-principal)]">
                                {parEmploye.get(d.employeId) ?? d.employeId}
                              </p>
                              <p className="text-sm text-[var(--texte-secondaire)]">
                                {libelleTypeConge(d.type)}
                              </p>
                            </div>
                            <Pastille ton={pastilleStatut(d.statut)}>{libelleStatutConge(d.statut)}</Pastille>
                          </div>
                          <p className="mb-2 text-xs text-[var(--texte-secondaire)]">
                            {format(parseISO(d.dateDebut), "d MMM", { locale: fr })} →{" "}
                            {format(parseISO(d.dateFin), "d MMM yyyy", { locale: fr })}
                          </p>
                          {d.commentaireRh && (
                            <p className="truncate text-xs text-[var(--texte-secondaire)]">
                              {d.commentaireRh}
                            </p>
                          )}
                        </div>
                        {ouvert && b && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 space-y-3 border-t border-[var(--bordure)] pt-4"
                          >
                            <div className="space-y-2">
                              <Etiquette>Commentaire RH</Etiquette>
                              <ZoneTexte
                                rows={2}
                                value={b.commentaireRh}
                                onChange={(e) =>
                                  setBrouillons((prev) => ({
                                    ...prev,
                                    [d.id]: { ...b, commentaireRh: e.target.value },
                                  }))
                                }
                                placeholder="Message transmis a l'employe..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Etiquette>Statut</Etiquette>
                              <select
                                className="h-9 w-full rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-2 text-sm"
                                value={b.statut}
                                onChange={(e) =>
                                  setBrouillons((prev) => ({
                                    ...prev,
                                    [d.id]: { ...b, statut: e.target.value as StatutDemandeConge },
                                  }))
                                }
                              >
                                {(["en_attente", "valide", "refuse", "annule"] as StatutDemandeConge[]).map((s) => (
                                  <option key={s} value={s}>
                                    {libelleStatutConge(s)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <Bouton
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                void enregistrer(d.id);
                              }}
                              disabled={mutation.isPending}
                              className="w-full"
                            >
                              <Save className="size-4" />
                              Enregistrer
                            </Bouton>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--bordure)] pt-4">
                <p className="text-sm text-[var(--texte-secondaire)]">
                  Page {pageCourante} sur {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Bouton
                    taille="sm"
                    variante="secondaire"
                    onClick={() => setPageCourante((p) => Math.max(1, p - 1))}
                    disabled={pageCourante === 1}
                  >
                    Precedent
                  </Bouton>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Bouton
                        key={page}
                        taille="sm"
                        variante={page === pageCourante ? "defaut" : "fantome"}
                        onClick={() => setPageCourante(page)}
                        className="min-w-[36px]"
                      >
                        {page}
                      </Bouton>
                    ))}
                  </div>
                  <Bouton
                    taille="sm"
                    variante="secondaire"
                    onClick={() => setPageCourante((p) => Math.min(totalPages, p + 1))}
                    disabled={pageCourante === totalPages}
                  >
                    Suivant
                  </Bouton>
                </div>
              </div>
            )}
          </CarteContenu>
        </Carte>

        <CalendrierConges demandes={conges} />
      </div>
    </div>
  );
}
