"use client";

import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
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

const lignes = [
  { employe: "Thomas Martin", motif: "RTT", du: subDays(new Date(), 6), statut: "Déclaré" },
  { employe: "Karim Benali", motif: "Arrêt maladie", du: subDays(new Date(), 18), statut: "Justifié" },
  { employe: "Léa Bernard", motif: "Télétravail exceptionnel", du: subDays(new Date(), 2), statut: "En validation" },
];

export function PageAbsences() {
  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Absences & indisponibilités</CarteTitre>
        <CarteDescription>Données de démonstration — intégration future avec la pointeuse / paie.</CarteDescription>
      </CarteEntete>
      <CarteContenu>
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
            {lignes.map((l, i) => (
              <TableauRangee key={i}>
                <TableauCellule className="font-medium">{l.employe}</TableauCellule>
                <TableauCellule>{l.motif}</TableauCellule>
                <TableauCellule className="text-xs">
                  {format(l.du, "d MMMM yyyy", { locale: fr })}
                </TableauCellule>
                <TableauCellule>
                  <Pastille ton={l.statut === "Justifié" ? "succes" : "alerte"}>{l.statut}</Pastille>
                </TableauCellule>
              </TableauRangee>
            ))}
          </TableauCorps>
        </Tableau>
      </CarteContenu>
    </Carte>
  );
}
