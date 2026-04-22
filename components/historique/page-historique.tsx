"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { History, FileText, Loader2 } from "lucide-react";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
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
import { Pastille } from "@/components/ui/badge";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";
import { useEmployes } from "@/hooks/queries/use-employes";
import { useNotifications } from "@/hooks/queries/use-notifications";
import { creerAbsencesDemo } from "@/lib/donnees-absences-demo";
import {
  construireEvenementsHistorique,
  filtrerAbsencesPourContexte,
  type LigneHistorique,
  type ModuleHistorique,
} from "@/lib/construire-evenements-historique";
import { magasinApplication } from "@/stores/magasin-application";

const OPTIONS_MODULE: { valeur: ModuleHistorique; libelle: string }[] = [
  { valeur: "conges", libelle: "Congés" },
  { valeur: "documents", libelle: "Documents" },
  { valeur: "notifications", libelle: "Notifications" },
  { valeur: "absences", libelle: "Absences" },
];

const ELEMENTS_PAR_PAGE = 8;

export function PageHistorique() {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const roleEmployesActif =
    utilisateur?.role === "rh" || utilisateur?.role === "manager" ? true : false;

  const { data: conges = [], isPending: chargeConges } = useConges();
  const { data: documents = [], isPending: chargeDocuments } = useDocuments();
  const { data: employes = [], isPending: chargeEmployes } = useEmployes({
    enabled: roleEmployesActif,
  });
  const { data: notifications = [], isPending: chargeNotifications } = useNotifications();

  const [recherche, setRecherche] = useState("");
  const [filtreModule, setFiltreModule] = useState("");
  const [filtreCollaborateur, setFiltreCollaborateur] = useState("");
  const [page, setPage] = useState(1);

  const carnetEmployes = useMemo(() => {
    if (!utilisateur) return [];
    if (employes.length > 0) return employes;
    return [utilisateur];
  }, [employes, utilisateur]);

  const absencesFiltrees = useMemo(() => {
    if (!utilisateur) return [];
    return filtrerAbsencesPourContexte(creerAbsencesDemo(), utilisateur.role, utilisateur, employes);
  }, [utilisateur, employes]);

  const lignesCompletes = useMemo(() => {
    if (!utilisateur) return [];
    return construireEvenementsHistorique({
      employes: carnetEmployes,
      conges,
      documents,
      notifications,
      absences: absencesFiltrees,
      utilisateur,
    });
  }, [utilisateur, carnetEmployes, conges, documents, notifications, absencesFiltrees]);

  const lignesPourUtilisateur = useMemo(() => {
    if (!utilisateur) return [];
    if (utilisateur.role === "rh") return lignesCompletes;
    return lignesCompletes.filter((l) => l.employeIdsConcernes.includes(utilisateur.id));
  }, [utilisateur, lignesCompletes]);

  const optionsCollaborateur = useMemo(() => {
    const noms = [...new Set(lignesPourUtilisateur.map((l) => l.collaborateur))].sort((a, b) =>
      a.localeCompare(b, "fr"),
    );
    return noms.map((n) => ({ valeur: n, libelle: n }));
  }, [lignesPourUtilisateur]);

  const donneesFiltrees = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return lignesPourUtilisateur.filter((l) => {
      const texte = `${l.espace} ${l.collaborateur} ${l.evenement} ${l.detail} ${l.etat}`.toLowerCase();
      const correspondRecherche = !q || texte.includes(q);
      const correspondModule = !filtreModule || l.module === filtreModule;
      const correspondCollab = !filtreCollaborateur || l.collaborateur === filtreCollaborateur;
      return correspondRecherche && correspondModule && correspondCollab;
    });
  }, [lignesPourUtilisateur, recherche, filtreModule, filtreCollaborateur]);

  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE,
  );

  const charge =
    chargeConges || chargeDocuments || chargeNotifications || (roleEmployesActif && chargeEmployes);

  const handleRecherche = (val: string) => {
    setRecherche(val);
    setPage(1);
  };

  const handleFiltreModule = (val: string) => {
    setFiltreModule(val);
    setPage(1);
  };

  const handleFiltreCollaborateur = (val: string) => {
    setFiltreCollaborateur(val);
    setPage(1);
  };

  if (!utilisateur) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
          <History className="size-6 text-[var(--accent-principal)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Historique</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">
            {utilisateur.role !== "rh" ? (
              <>
                Congés, documents, absences et notifications vous concernant — {donneesFiltrees.length}{" "}
                entrée
                {donneesFiltrees.length > 1 ? "s" : ""}
              </>
            ) : (
              <>
                Vue consolidée des espaces Congés, Documents, Absences et Notifications —{" "}
                {donneesFiltrees.length} entrée{donneesFiltrees.length > 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Journal des opérations</CarteTitre>
          <CarteDescription>
            Chaque ligne reprend les informations utiles des écrans correspondants : personne concernée,
            nature de l&apos;événement, précisions (dates, types, messages) et état de suivi.
          </CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={handleRecherche}
              placeholder="Rechercher (espace, collaborateur, événement, détail…)"
              className="w-full sm:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              <FiltreSelect
                valeur={filtreModule}
                onChangerValeur={handleFiltreModule}
                options={OPTIONS_MODULE}
                placeholder="Tous les espaces"
                label="Filtrer par espace"
                className="w-full sm:w-48"
              />
              <FiltreSelect
                valeur={filtreCollaborateur}
                onChangerValeur={handleFiltreCollaborateur}
                options={optionsCollaborateur}
                placeholder="Tous les collaborateurs"
                label="Filtrer par collaborateur"
                className="w-full sm:w-52"
              />
            </div>
          </div>

          {charge ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Loader2 className="size-10 animate-spin text-[var(--accent-principal)]" />
              <p className="text-sm text-[var(--texte-secondaire)]">Chargement de l&apos;historique…</p>
            </div>
          ) : donneesPaginees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">Aucune entrée ne correspond à vos filtres.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--bordure)]/40">
              <Tableau>
                <TableauEntete>
                  <TableauRangee>
                    <TableauCelluleEntete className="min-w-[9.5rem]">Date et heure</TableauCelluleEntete>
                    <TableauCelluleEntete className="min-w-[7rem]">Espace</TableauCelluleEntete>
                    <TableauCelluleEntete className="min-w-[8.5rem]">Collaborateur</TableauCelluleEntete>
                    <TableauCelluleEntete className="min-w-[10rem]">Événement</TableauCelluleEntete>
                    <TableauCelluleEntete className="min-w-[14rem]">Détail</TableauCelluleEntete>
                    <TableauCelluleEntete className="min-w-[7rem]">État</TableauCelluleEntete>
                  </TableauRangee>
                </TableauEntete>
                <TableauCorps>
                  {donneesPaginees.map((l: LigneHistorique) => (
                    <TableauRangee key={l.id} className="group ligne-liste-luxe align-top">
                      <TableauCellule className="whitespace-nowrap text-xs tabular-nums">
                        {format(l.quand, "dd/MM/yyyy HH:mm", { locale: fr })}
                      </TableauCellule>
                      <TableauCellule>
                        <Pastille ton="neutre" className="normal-case tracking-normal">
                          {l.espace}
                        </Pastille>
                      </TableauCellule>
                      <TableauCellule>
                        <span className="font-medium text-[var(--texte-principal)]">{l.collaborateur}</span>
                      </TableauCellule>
                      <TableauCellule className="text-sm">{l.evenement}</TableauCellule>
                      <TableauCellule className="max-w-[22rem] text-sm text-[var(--texte-secondaire)] leading-snug">
                        {l.detail}
                      </TableauCellule>
                      <TableauCellule>
                        <Pastille ton={l.tonEtat} className="normal-case tracking-normal">
                          {l.etat}
                        </Pastille>
                      </TableauCellule>
                    </TableauRangee>
                  ))}
                </TableauCorps>
              </Tableau>
            </div>
          )}

          {!charge && donneesFiltrees.length > 0 && (
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
    </div>
  );
}
