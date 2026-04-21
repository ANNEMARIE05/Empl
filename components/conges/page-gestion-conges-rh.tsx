"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Save } from "lucide-react";
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
import type { DemandeConge, StatutDemandeConge } from "@/types";

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

  const parEmploye = useMemo(() => {
    const map = new Map<string, string>();
    employes.forEach((e) => map.set(e.id, `${e.prenom} ${e.nom}`));
    return map;
  }, [employes]);

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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Carte className="animate-shimmer">
          <CarteEntete>
            <CarteTitre>File des demandes</CarteTitre>
            <CarteDescription>
              Cliquez sur une ligne pour saisir le <strong>commentaire RH</strong> (visible dans le dossier) et la{" "}
              <strong>note interne</strong> (mémo RH).
            </CarteDescription>
          </CarteEntete>
          <CarteContenu className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
                <Squelette className="h-10 w-full" />
              </div>
            ) : (
              <Tableau>
                <TableauEntete>
                  <TableauRangee>
                    <TableauCelluleEntete className="w-8" />
                    <TableauCelluleEntete>Employé</TableauCelluleEntete>
                    <TableauCelluleEntete>Type</TableauCelluleEntete>
                    <TableauCelluleEntete>Période</TableauCelluleEntete>
                    <TableauCelluleEntete>Statut</TableauCelluleEntete>
                    <TableauCelluleEntete>Commentaire actuel</TableauCelluleEntete>
                  </TableauRangee>
                </TableauEntete>
                <TableauCorps>
                  {conges.map((d) => {
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
                                  <Etiquette>Commentaire RH (partagé / dossier)</Etiquette>
                                  <ZoneTexte
                                    rows={4}
                                    value={b.commentaireRh}
                                    onChange={(e) =>
                                      setBrouillons((prev) => ({
                                        ...prev,
                                        [d.id]: { ...b, commentaireRh: e.target.value },
                                      }))
                                    }
                                    placeholder="Message transmis à l’employé ou consigné au dossier…"
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
                                    placeholder="Mémo interne : contexte manager, risque couverture…"
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
                  })}
                </TableauCorps>
              </Tableau>
            )}
          </CarteContenu>
        </Carte>

        <CalendrierConges demandes={conges} />
      </div>
    </div>
  );
}
