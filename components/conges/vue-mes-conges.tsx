"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useConges, useCreationDemandeConge } from "@/hooks/queries/use-conges";
import type { StatutDemandeConge, TypeConge } from "@/types";

function pastilleStatut(statut: StatutDemandeConge): NonNullable<PastilleProps["ton"]> {
  if (statut === "valide") return "succes";
  if (statut === "refuse" || statut === "annule") return "danger";
  if (statut === "en_attente") return "alerte";
  return "neutre";
}

export function VueMesConges({ impulsionFormulaire = 0 }: { impulsionFormulaire?: number }) {
  const { data: conges = [], isLoading } = useConges();
  const creation = useCreationDemandeConge();
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<TypeConge>("annuel");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [motif, setMotif] = useState("");

  const soumettre = async () => {
    await creation.mutateAsync({ type, dateDebut, dateFin, motif });
    setOuvert(false);
    setMotif("");
  };

  useEffect(() => {
    if (impulsionFormulaire <= 0) return;
    const id = window.setTimeout(() => setOuvert(true), 0);
    return () => window.clearTimeout(id);
  }, [impulsionFormulaire]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Carte>
        <CarteEntete className="flex flex-row items-start justify-between gap-3">
          <div>
            <CarteTitre>Mes demandes</CarteTitre>
            <CarteDescription>Historique et statut de traitement par les RH.</CarteDescription>
          </div>
          <Bouton taille="sm" onClick={() => setOuvert(true)}>
            <Plus className="size-4" />
            Nouvelle demande
          </Bouton>
        </CarteEntete>
        <CarteContenu>
          {isLoading ? (
            <div className="space-y-2">
              <Squelette className="h-10 w-full" />
              <Squelette className="h-10 w-full" />
            </div>
          ) : (
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete>Type</TableauCelluleEntete>
                  <TableauCelluleEntete>Période</TableauCelluleEntete>
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                  <TableauCelluleEntete>Commentaire RH</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {conges.map((d) => (
                  <TableauRangee key={d.id}>
                    <TableauCellule>{libelleTypeConge(d.type)}</TableauCellule>
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
        </CarteContenu>
      </Carte>

      <CalendrierConges demandes={conges} />

      <Dialogue open={ouvert} onOpenChange={setOuvert}>
        <ContenuDialogue>
          <EnteteDialogue>
            <TitreDialogue>Nouvelle demande de congés</TitreDialogue>
          </EnteteDialogue>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Etiquette>Type</Etiquette>
              <select
                className="h-9 w-full rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-2 text-sm"
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
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Etiquette>Début</Etiquette>
                <Entree type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Etiquette>Fin</Etiquette>
                <Entree type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Etiquette>Motif</Etiquette>
              <ZoneTexte rows={3} value={motif} onChange={(e) => setMotif(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Bouton variante="secondaire" type="button" onClick={() => setOuvert(false)}>
                Annuler
              </Bouton>
              <Bouton type="button" disabled={creation.isPending || !dateDebut || !dateFin} onClick={() => void soumettre()}>
                Envoyer
              </Bouton>
            </div>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </div>
  );
}
