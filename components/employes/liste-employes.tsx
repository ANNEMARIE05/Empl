"use client";

import Image from "next/image";
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
import { useEmployes } from "@/hooks/queries/use-employes";

function libelleRole(role: string) {
  if (role === "rh") return "RH";
  if (role === "manager") return "Manager";
  return "Employé";
}

export function ListeEmployes() {
  const { data: employes = [], isLoading, isError } = useEmployes();

  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Effectifs</CarteTitre>
        <CarteDescription>
          Vue tableau : identité, rôle et rattachement. Les employés n’ont pas accès à cette liste.
        </CarteDescription>
      </CarteEntete>
      <CarteContenu>
        {isLoading ? (
          <div className="space-y-2">
            <Squelette className="h-10 w-full" />
            <Squelette className="h-10 w-full" />
          </div>
        ) : isError ? (
          <p className="text-sm text-[var(--danger)]">Impossible de charger les employés.</p>
        ) : (
          <Tableau>
            <TableauEntete>
              <TableauRangee>
                <TableauCelluleEntete className="w-14" />
                <TableauCelluleEntete>Nom</TableauCelluleEntete>
                <TableauCelluleEntete>Email</TableauCelluleEntete>
                <TableauCelluleEntete>Département</TableauCelluleEntete>
                <TableauCelluleEntete>Poste</TableauCelluleEntete>
                <TableauCelluleEntete>Rôle</TableauCelluleEntete>
              </TableauRangee>
            </TableauEntete>
            <TableauCorps>
              {employes.map((e) => (
                <TableauRangee key={e.id}>
                  <TableauCellule>
                    <div className="relative size-9 overflow-hidden rounded-[var(--rayon-sm)] border border-[var(--bordure)]">
                      {e.photoUrl ? (
                        <Image src={e.photoUrl} alt="" fill className="object-cover" sizes="36px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold">
                          {e.prenom[0]}
                          {e.nom[0]}
                        </div>
                      )}
                    </div>
                  </TableauCellule>
                  <TableauCellule className="font-medium">
                    {e.prenom} {e.nom}
                  </TableauCellule>
                  <TableauCellule className="text-xs text-[var(--texte-secondaire)]">{e.email}</TableauCellule>
                  <TableauCellule className="text-xs">{e.departement}</TableauCellule>
                  <TableauCellule className="text-xs">{e.poste}</TableauCellule>
                  <TableauCellule>
                    <Pastille ton={e.role === "rh" ? "accent" : e.role === "manager" ? "alerte" : "neutre"}>
                      {libelleRole(e.role)}
                    </Pastille>
                  </TableauCellule>
                </TableauRangee>
              ))}
            </TableauCorps>
          </Tableau>
        )}
      </CarteContenu>
    </Carte>
  );
}
