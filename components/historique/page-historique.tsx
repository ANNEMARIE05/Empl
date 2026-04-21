"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import {
  Tableau,
  TableauCellule,
  TableauCelluleEntete,
  TableauCorps,
  TableauEntete,
  TableauRangee,
} from "@/components/ui/table";

const evenements = [
  { quand: new Date(), acteur: "Marie Dubois", action: "Validation congé", cible: "Thomas Martin" },
  { quand: new Date(Date.now() - 86400000), acteur: "Système", action: "Création demande document", cible: "Karim Benali" },
  { quand: new Date(Date.now() - 86400000 * 3), acteur: "Thomas Martin", action: "Soumission demande congés", cible: "Thomas Martin" },
];

export function PageHistorique() {
  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Journal d’activité</CarteTitre>
        <CarteDescription>Événements récents (mock) pour audit interne.</CarteDescription>
      </CarteEntete>
      <CarteContenu>
        <Tableau>
          <TableauEntete>
            <TableauRangee>
              <TableauCelluleEntete>Horodatage</TableauCelluleEntete>
              <TableauCelluleEntete>Acteur</TableauCelluleEntete>
              <TableauCelluleEntete>Action</TableauCelluleEntete>
              <TableauCelluleEntete>Cible</TableauCelluleEntete>
            </TableauRangee>
          </TableauEntete>
          <TableauCorps>
            {evenements.map((e, i) => (
              <TableauRangee key={i}>
                <TableauCellule className="whitespace-nowrap text-xs">
                  {format(e.quand, "dd/MM/yyyy HH:mm", { locale: fr })}
                </TableauCellule>
                <TableauCellule>{e.acteur}</TableauCellule>
                <TableauCellule>{e.action}</TableauCellule>
                <TableauCellule>{e.cible}</TableauCellule>
              </TableauRangee>
            ))}
          </TableauCorps>
        </Tableau>
      </CarteContenu>
    </Carte>
  );
}
