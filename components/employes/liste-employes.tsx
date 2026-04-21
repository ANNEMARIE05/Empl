"use client";

import Image from "next/image";
import { Users } from "lucide-react";
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
  return "Employe";
}

export function ListeEmployes() {
  const { data: employes = [], isLoading, isError } = useEmployes();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
          <Users className="size-6 text-[var(--accent-principal)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Annuaire des employes</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">{employes.length} membres dans l&apos;organisation</p>
        </div>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Liste des effectifs</CarteTitre>
          <CarteDescription>
            Identite, role et rattachement de chaque membre de l&apos;equipe.
          </CarteDescription>
        </CarteEntete>
        <CarteContenu>
          {isLoading ? (
            <div className="space-y-3">
              <Squelette className="h-12 w-full rounded-lg" />
              <Squelette className="h-12 w-full rounded-lg" />
              <Squelette className="h-12 w-full rounded-lg" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/5 p-4 text-center">
              <p className="text-sm font-medium text-[var(--danger)]">Impossible de charger les employes.</p>
            </div>
          ) : (
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete className="w-16" />
                  <TableauCelluleEntete>Nom complet</TableauCelluleEntete>
                  <TableauCelluleEntete>Email</TableauCelluleEntete>
                  <TableauCelluleEntete>Departement</TableauCelluleEntete>
                  <TableauCelluleEntete>Poste</TableauCelluleEntete>
                  <TableauCelluleEntete>Role</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {employes.map((e) => (
                  <TableauRangee key={e.id} className="group">
                    <TableauCellule>
                      <div className="relative size-10 overflow-hidden rounded-xl border border-[var(--bordure)]/50 bg-[var(--surface-mute)] transition-transform group-hover:scale-105">
                        {e.photoUrl ? (
                          <Image src={e.photoUrl} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--texte-secondaire)]">
                            {e.prenom[0]}
                            {e.nom[0]}
                          </div>
                        )}
                      </div>
                    </TableauCellule>
                    <TableauCellule>
                      <span className="font-semibold">{e.prenom} {e.nom}</span>
                    </TableauCellule>
                    <TableauCellule>
                      <span className="text-sm text-[var(--texte-secondaire)]">{e.email}</span>
                    </TableauCellule>
                    <TableauCellule>
                      <span className="text-sm">{e.departement}</span>
                    </TableauCellule>
                    <TableauCellule>
                      <span className="text-sm">{e.poste}</span>
                    </TableauCellule>
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
    </div>
  );
}
