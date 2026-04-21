"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { libelleStatutDocument, libelleTypeDocument } from "@/components/documents/libelles-documents";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
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
import { ZoneTexte } from "@/components/ui/textarea";
import { useDocuments, useMiseAJourDocumentRh } from "@/hooks/queries/use-documents";
import { useEmployes } from "@/hooks/queries/use-employes";
import type { DemandeDocument, StatutDemandeDocument } from "@/types";

export function PageDocumentsRh() {
  const { data: documents = [], isLoading } = useDocuments();
  const { data: employes = [] } = useEmployes();
  const mutation = useMiseAJourDocumentRh();
  const [brouillons, setBrouillons] = useState<
    Record<string, { commentaireRh: string; statut: StatutDemandeDocument }>
  >({});

  const noms = useMemo(() => {
    const m = new Map<string, string>();
    employes.forEach((e) => m.set(e.id, `${e.prenom} ${e.nom}`));
    return m;
  }, [employes]);

  const lireBrouillon = (d: DemandeDocument) =>
    brouillons[d.id] ?? { commentaireRh: d.commentaireRh ?? "", statut: d.statut };

  const enregistrer = async (d: DemandeDocument) => {
    const b = lireBrouillon(d);
    await mutation.mutateAsync({ id: d.id, commentaireRh: b.commentaireRh, statut: b.statut });
  };

  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Demandes de documents</CarteTitre>
        <CarteDescription>Traitement RH : statut et commentaire visibles côté employé.</CarteDescription>
      </CarteEntete>
      <CarteContenu>
        {isLoading ? (
          <Squelette className="h-40 w-full" />
        ) : (
          <Tableau>
            <TableauEntete>
              <TableauRangee>
                <TableauCelluleEntete>Employé</TableauCelluleEntete>
                <TableauCelluleEntete>Type</TableauCelluleEntete>
                <TableauCelluleEntete>Statut</TableauCelluleEntete>
                <TableauCelluleEntete>Commentaire employé</TableauCelluleEntete>
                <TableauCelluleEntete>Commentaire RH</TableauCelluleEntete>
                <TableauCelluleEntete className="text-right">Actions</TableauCelluleEntete>
              </TableauRangee>
            </TableauEntete>
            <TableauCorps>
              {documents.map((d) => {
                const b = lireBrouillon(d);
                return (
                  <TableauRangee key={d.id} className="align-top">
                    <TableauCellule className="font-medium">{noms.get(d.employeId) ?? d.employeId}</TableauCellule>
                    <TableauCellule>{libelleTypeDocument(d.type)}</TableauCellule>
                    <TableauCellule>
                      <select
                        className="h-8 w-full rounded-[var(--rayon-sm)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-1 text-xs"
                        value={b.statut}
                        onChange={(e) =>
                          setBrouillons((p) => ({
                            ...p,
                            [d.id]: { ...b, statut: e.target.value as StatutDemandeDocument },
                          }))
                        }
                      >
                        {(["en_attente", "en_traitement", "pret", "refuse"] as StatutDemandeDocument[]).map((s) => (
                          <option key={s} value={s}>
                            {libelleStatutDocument(s)}
                          </option>
                        ))}
                      </select>
                    </TableauCellule>
                    <TableauCellule className="max-w-xs text-xs text-[var(--texte-secondaire)]">
                      {d.commentaireEmploye ?? "—"}
                    </TableauCellule>
                    <TableauCellule className="min-w-[220px]">
                      <ZoneTexte
                        rows={3}
                        className="text-xs"
                        value={b.commentaireRh}
                        onChange={(e) =>
                          setBrouillons((p) => ({
                            ...p,
                            [d.id]: { ...b, commentaireRh: e.target.value },
                          }))
                        }
                      />
                    </TableauCellule>
                    <TableauCellule className="text-right">
                      <div className="flex flex-col items-end gap-2">
                        <Pastille ton={b.statut === "pret" ? "succes" : b.statut === "refuse" ? "danger" : "alerte"}>
                          {libelleStatutDocument(b.statut)}
                        </Pastille>
                        <span className="text-[10px] text-[var(--texte-secondaire)]">
                          {format(parseISO(d.creeLe), "d MMM yyyy", { locale: fr })}
                        </span>
                        <Bouton
                          taille="sm"
                          type="button"
                          onClick={() => void enregistrer(d)}
                          disabled={mutation.isPending}
                        >
                          Mettre à jour
                        </Bouton>
                      </div>
                    </TableauCellule>
                  </TableauRangee>
                );
              })}
            </TableauCorps>
          </Tableau>
        )}
      </CarteContenu>
    </Carte>
  );
}
