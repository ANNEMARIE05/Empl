"use client";

import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { History, FileText } from "lucide-react";
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
import { magasinApplication } from "@/stores/magasin-application";

interface Evenement {
  id: string;
  quand: Date;
  acteur: string;
  action: string;
  cible: string;
  type: "validation" | "creation" | "modification" | "suppression" | "soumission";
  /** Employés pour lesquels l’événement est pertinent (audit personnel). */
  employeIdsConcernes: string[];
}

const evenementsMock: Evenement[] = [
  {
    id: "h1",
    quand: new Date(),
    acteur: "Marie Dubois",
    action: "Validation conge",
    cible: "Thomas Martin",
    type: "validation",
    employeIdsConcernes: ["e1", "e2"],
  },
  {
    id: "h2",
    quand: subDays(new Date(), 1),
    acteur: "Systeme",
    action: "Creation demande document",
    cible: "Karim Benali",
    type: "creation",
    employeIdsConcernes: ["e4"],
  },
  {
    id: "h3",
    quand: subDays(new Date(), 3),
    acteur: "Thomas Martin",
    action: "Soumission demande conges",
    cible: "Thomas Martin",
    type: "soumission",
    employeIdsConcernes: ["e2"],
  },
  {
    id: "h4",
    quand: subDays(new Date(), 4),
    acteur: "Lea Bernard",
    action: "Modification profil",
    cible: "Lea Bernard",
    type: "modification",
    employeIdsConcernes: ["e3"],
  },
  {
    id: "h5",
    quand: subDays(new Date(), 5),
    acteur: "Marie Dubois",
    action: "Suppression document",
    cible: "Ancien document",
    type: "suppression",
    employeIdsConcernes: ["e1"],
  },
  {
    id: "h6",
    quand: subDays(new Date(), 6),
    acteur: "Karim Benali",
    action: "Soumission demande RTT",
    cible: "Karim Benali",
    type: "soumission",
    employeIdsConcernes: ["e4"],
  },
  {
    id: "h7",
    quand: subDays(new Date(), 7),
    acteur: "Marie Dubois",
    action: "Validation conge",
    cible: "Lea Bernard",
    type: "validation",
    employeIdsConcernes: ["e1", "e3"],
  },
  {
    id: "h8",
    quand: subDays(new Date(), 8),
    acteur: "Systeme",
    action: "Creation notification",
    cible: "Tous les employes",
    type: "creation",
    employeIdsConcernes: ["e1", "e2", "e3", "e4"],
  },
  {
    id: "h9",
    quand: subDays(new Date(), 9),
    acteur: "Thomas Martin",
    action: "Modification coordonnees",
    cible: "Thomas Martin",
    type: "modification",
    employeIdsConcernes: ["e2"],
  },
  {
    id: "h10",
    quand: subDays(new Date(), 10),
    acteur: "Marie Dubois",
    action: "Creation employe",
    cible: "Pierre Durand",
    type: "creation",
    employeIdsConcernes: ["e1"],
  },
  {
    id: "h11",
    quand: subDays(new Date(), 11),
    acteur: "Lea Bernard",
    action: "Soumission absence",
    cible: "Lea Bernard",
    type: "soumission",
    employeIdsConcernes: ["e3"],
  },
  {
    id: "h12",
    quand: subDays(new Date(), 12),
    acteur: "Systeme",
    action: "Rappel automatique",
    cible: "Validation en attente",
    type: "creation",
    employeIdsConcernes: ["e1"],
  },
];

const optionsType = [
  { valeur: "validation", libelle: "Validation" },
  { valeur: "creation", libelle: "Creation" },
  { valeur: "modification", libelle: "Modification" },
  { valeur: "suppression", libelle: "Suppression" },
  { valeur: "soumission", libelle: "Soumission" },
];

const ELEMENTS_PAR_PAGE = 5;

function getTonType(type: Evenement["type"]) {
  switch (type) {
    case "validation":
      return "succes";
    case "creation":
      return "accent";
    case "modification":
      return "alerte";
    case "suppression":
      return "danger";
    case "soumission":
      return "neutre";
    default:
      return "neutre";
  }
}

export function PageHistorique() {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("");
  const [filtreActeur, setFiltreActeur] = useState("");
  const [page, setPage] = useState(1);

  const evenementsPourUtilisateur = useMemo(() => {
    if (!utilisateur) return [];
    if (utilisateur.role === "rh") return evenementsMock;
    return evenementsMock.filter((e) => e.employeIdsConcernes.includes(utilisateur.id));
  }, [utilisateur]);

  const optionsActeur = useMemo(() => {
    const acteurs = [...new Set(evenementsPourUtilisateur.map((e) => e.acteur))].sort((a, b) =>
      a.localeCompare(b, "fr")
    );
    return acteurs.map((a) => ({ valeur: a, libelle: a }));
  }, [evenementsPourUtilisateur]);

  const donneesFiltrees = useMemo(() => {
    return evenementsPourUtilisateur.filter((e) => {
      const correspondRecherche =
        e.acteur.toLowerCase().includes(recherche.toLowerCase()) ||
        e.action.toLowerCase().includes(recherche.toLowerCase()) ||
        e.cible.toLowerCase().includes(recherche.toLowerCase());
      const correspondType = !filtreType || e.type === filtreType;
      const correspondActeur = !filtreActeur || e.acteur === filtreActeur;
      return correspondRecherche && correspondType && correspondActeur;
    });
  }, [evenementsPourUtilisateur, recherche, filtreType, filtreActeur]);

  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

  const handleRecherche = (val: string) => {
    setRecherche(val);
    setPage(1);
  };

  const handleFiltreType = (val: string) => {
    setFiltreType(val);
    setPage(1);
  };

  const handleFiltreActeur = (val: string) => {
    setFiltreActeur(val);
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
          <h2 className="text-xl font-bold tracking-tight">Journal d&apos;activite</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">
            {utilisateur.role !== "rh" ? (
              <>
                Votre historique personnel — {donneesFiltrees.length} evenement
                {donneesFiltrees.length > 1 ? "s" : ""} enregistre{donneesFiltrees.length > 1 ? "s" : ""}
              </>
            ) : (
              <>
                {donneesFiltrees.length} evenement{donneesFiltrees.length > 1 ? "s" : ""} enregistre
                {donneesFiltrees.length > 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Historique des actions</CarteTitre>
          <CarteDescription>Evenements recents pour audit interne et suivi.</CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de filtres et recherche */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={handleRecherche}
              placeholder="Rechercher acteur, action, cible..."
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <FiltreSelect
                valeur={filtreType}
                onChangerValeur={handleFiltreType}
                options={optionsType}
                placeholder="Tous les types"
                label="Filtrer par type"
                className="w-full sm:w-44"
              />
              <FiltreSelect
                valeur={filtreActeur}
                onChangerValeur={handleFiltreActeur}
                options={optionsActeur}
                placeholder="Tous les acteurs"
                label="Filtrer par acteur"
                className="w-full sm:w-44"
              />
            </div>
          </div>

          {/* Tableau */}
          {donneesPaginees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">Aucun evenement trouve.</p>
            </div>
          ) : (
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete>Horodatage</TableauCelluleEntete>
                  <TableauCelluleEntete>Acteur</TableauCelluleEntete>
                  <TableauCelluleEntete>Action</TableauCelluleEntete>
                  <TableauCelluleEntete>Cible</TableauCelluleEntete>
                  <TableauCelluleEntete>Type</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {donneesPaginees.map((e) => (
                  <TableauRangee key={e.id} className="group ligne-liste-luxe">
                    <TableauCellule className="whitespace-nowrap text-xs">
                      {format(e.quand, "dd/MM/yyyy HH:mm", { locale: fr })}
                    </TableauCellule>
                    <TableauCellule>
                      <span className="font-medium">{e.acteur}</span>
                    </TableauCellule>
                    <TableauCellule>{e.action}</TableauCellule>
                    <TableauCellule>
                      <span className="text-[var(--texte-secondaire)]">{e.cible}</span>
                    </TableauCellule>
                    <TableauCellule>
                      <Pastille ton={getTonType(e.type)}>
                        {e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                      </Pastille>
                    </TableauCellule>
                  </TableauRangee>
                ))}
              </TableauCorps>
            </Tableau>
          )}

          {/* Pagination */}
          {donneesFiltrees.length > 0 && (
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
