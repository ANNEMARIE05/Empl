"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useCreationDemandeDocument, useDocuments } from "@/hooks/queries/use-documents";
import type { StatutDemandeDocument, TypeDocument } from "@/types";

function tonStatut(s: StatutDemandeDocument) {
  if (s === "pret") return "succes";
  if (s === "refuse") return "danger";
  return "alerte";
}

export function VueMesDocuments({ impulsionFormulaire = 0 }: { impulsionFormulaire?: number }) {
  const { data: documents = [], isLoading } = useDocuments();
  const creation = useCreationDemandeDocument();
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<TypeDocument>("attestation_salaire");
  const [commentaireEmploye, setCommentaireEmploye] = useState("");

  const envoyer = async () => {
    await creation.mutateAsync({ type, commentaireEmploye });
    setOuvert(false);
    setCommentaireEmploye("");
  };

  useEffect(() => {
    if (impulsionFormulaire <= 0) return;
    const id = window.setTimeout(() => setOuvert(true), 0);
    return () => window.clearTimeout(id);
  }, [impulsionFormulaire]);

  return (
    <Carte>
      <CarteEntete className="flex flex-row items-start justify-between gap-3">
        <div>
          <CarteTitre>Mes demandes</CarteTitre>
          <CarteDescription>Suivi des pièces demandées aux RH.</CarteDescription>
        </div>
        <Bouton taille="sm" onClick={() => setOuvert(true)}>
          <Plus className="size-4" />
          Nouvelle demande
        </Bouton>
      </CarteEntete>
      <CarteContenu>
        {isLoading ? (
          <Squelette className="h-32 w-full" />
        ) : (
          <Tableau>
            <TableauEntete>
              <TableauRangee>
                <TableauCelluleEntete>Type</TableauCelluleEntete>
                <TableauCelluleEntete>Statut</TableauCelluleEntete>
                <TableauCelluleEntete>Commentaire RH</TableauCelluleEntete>
                <TableauCelluleEntete>Créée le</TableauCelluleEntete>
              </TableauRangee>
            </TableauEntete>
            <TableauCorps>
              {documents.map((d) => (
                <TableauRangee key={d.id}>
                  <TableauCellule>{libelleTypeDocument(d.type)}</TableauCellule>
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
      </CarteContenu>

      <Dialogue open={ouvert} onOpenChange={setOuvert}>
        <ContenuDialogue>
          <EnteteDialogue>
            <TitreDialogue>Nouvelle demande</TitreDialogue>
          </EnteteDialogue>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Etiquette>Type de document</Etiquette>
              <select
                className="h-9 w-full rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-2 text-sm"
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
              <Etiquette>Précisions</Etiquette>
              <ZoneTexte rows={3} value={commentaireEmploye} onChange={(e) => setCommentaireEmploye(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Bouton variante="secondaire" type="button" onClick={() => setOuvert(false)}>
                Annuler
              </Bouton>
              <Bouton type="button" disabled={creation.isPending} onClick={() => void envoyer()}>
                Envoyer
              </Bouton>
            </div>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </Carte>
  );
}
