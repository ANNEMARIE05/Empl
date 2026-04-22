"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { urlPhotoProfil } from "@/lib/url-photo-profil";
import { Users, Plus, Eye, Pencil, Trash2, Mail, Building, Briefcase, CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { libelleStatutConge, libelleTypeConge } from "@/components/conges/libelles-conges";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { EntetePage } from "@/components/ui/entete-page";
import { Pastille, type PastilleProps } from "@/components/ui/badge";
import { Squelette } from "@/components/ui/skeleton";
import { Bouton } from "@/components/ui/button";
import { Entree } from "@/components/ui/input";
import { Etiquette } from "@/components/ui/label";
import {
  Tableau,
  TableauCellule,
  TableauCelluleEntete,
  TableauCorps,
  TableauEntete,
  TableauRangee,
} from "@/components/ui/table";
import {
  Dialogue,
  ContenuDialogue,
  PiedDialogue,
  DeclencheurDialogue,
  EnteteDialogue,
  TitreDialogue,
  FermerDialogue,
} from "@/components/ui/dialog";
import { BarreRecherche } from "@/components/ui/barre-recherche";
import { FiltreSelect } from "@/components/ui/filtre-select";
import { Pagination } from "@/components/ui/pagination";
import { ToggleVue, type ModeVue } from "@/components/ui/toggle-vue";
import { useConges } from "@/hooks/queries/use-conges";
import { useEmployes, useCreerEmploye, useModifierEmploye, useSupprimerEmploye } from "@/hooks/queries/use-employes";
import type { Employe, RoleUtilisateur, StatutDemandeConge } from "@/types";

function libelleRole(role: string) {
  if (role === "rh") return "RH";
  if (role === "manager") return "Manager";
  return "Employe";
}

const optionsRole = [
  { valeur: "rh", libelle: "RH" },
  { valeur: "manager", libelle: "Manager" },
  { valeur: "employe", libelle: "Employe" },
];

const optionsDepartement = [
  { valeur: "Ressources humaines", libelle: "Ressources humaines" },
  { valeur: "Operations", libelle: "Operations" },
  { valeur: "Finance", libelle: "Finance" },
  { valeur: "Marketing", libelle: "Marketing" },
  { valeur: "Informatique", libelle: "Informatique" },
];

const ELEMENTS_PAR_PAGE = 6;

/** Taille de page des sous-tableaux detail employe (aligne sur Historique des actions). */
const ELEMENTS_PAR_PAGE_DETAIL = 5;

function pastilleStatutCongeRapide(statut: StatutDemandeConge): NonNullable<PastilleProps["ton"]> {
  if (statut === "valide") return "succes";
  if (statut === "refuse" || statut === "annule") return "danger";
  if (statut === "en_attente") return "alerte";
  return "neutre";
}

interface FormulaireEmployeProps {
  employe?: Employe | null;
  onSoumettre: (data: Omit<Employe, "id"> | Employe) => void;
  onAnnuler: () => void;
  isLoading?: boolean;
}

function FormulaireEmploye({ employe, onSoumettre, onAnnuler, isLoading }: FormulaireEmployeProps) {
  const [prenom, setPrenom] = useState(employe?.prenom || "");
  const [nom, setNom] = useState(employe?.nom || "");
  const [email, setEmail] = useState(employe?.email || "");
  const [role, setRole] = useState<RoleUtilisateur>(employe?.role || "employe");
  const [departement, setDepartement] = useState(employe?.departement || "");
  const [poste, setPoste] = useState(employe?.poste || "");
  const [dateEmbauche, setDateEmbauche] = useState(employe?.dateEmbauche || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...(employe?.id && { id: employe.id }),
      prenom,
      nom,
      email,
      role,
      departement,
      poste,
      dateEmbauche: dateEmbauche || new Date().toISOString().split("T")[0],
    };
    onSoumettre(data as Omit<Employe, "id"> | Employe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Etiquette htmlFor="prenom">Prenom</Etiquette>
          <Entree
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Jean"
            required
          />
        </div>
        <div className="space-y-2">
          <Etiquette htmlFor="nom">Nom</Etiquette>
          <Entree
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Dupont"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Etiquette htmlFor="email">Email</Etiquette>
        <Entree
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jean.dupont@entreprise.fr"
          required
        />
      </div>
      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Etiquette htmlFor="role">Role</Etiquette>
          <FiltreSelect
            valeur={role}
            onChangerValeur={(v) => setRole(v as RoleUtilisateur)}
            options={optionsRole}
            placeholder="Selectionner un role"
            avecIcone={false}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Etiquette htmlFor="departement">Departement</Etiquette>
          <FiltreSelect
            valeur={departement}
            onChangerValeur={setDepartement}
            options={optionsDepartement}
            placeholder="Selectionner"
            avecIcone={false}
            className="w-full"
          />
        </div>
      </div>
      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Etiquette htmlFor="poste">Poste</Etiquette>
          <Entree
            id="poste"
            value={poste}
            onChange={(e) => setPoste(e.target.value)}
            placeholder="Developpeur"
            required
          />
        </div>
        <div className="space-y-2">
          <Etiquette htmlFor="dateEmbauche">Date d&apos;embauche</Etiquette>
          <Entree
            id="dateEmbauche"
            type="date"
            value={dateEmbauche}
            onChange={(e) => setDateEmbauche(e.target.value)}
          />
        </div>
      </div>
      <PiedDialogue className="pt-4">
        <Bouton type="button" variante="secondaire" className="w-full sm:w-auto" onClick={onAnnuler}>
          Annuler
        </Bouton>
        <Bouton type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : employe ? "Modifier" : "Creer"}
        </Bouton>
      </PiedDialogue>
    </form>
  );
}

interface DetailEmployeProps {
  employe: Employe;
  onFermer: () => void;
}

function DetailEmploye({ employe, onFermer }: DetailEmployeProps) {
  const { data: tousConges = [], isLoading: chargementConges } = useConges();
  const [pageConges, setPageConges] = useState(1);

  useEffect(() => {
    setPageConges(1);
  }, [employe.id]);

  const congesEmploye = useMemo(
    () =>
      [...tousConges]
        .filter((c) => c.employeId === employe.id)
        .sort((a, b) => parseISO(b.creeLe).getTime() - parseISO(a.creeLe).getTime()),
    [tousConges, employe.id]
  );

  const congesPaginees = useMemo(() => {
    const debut = (pageConges - 1) * ELEMENTS_PAR_PAGE_DETAIL;
    return congesEmploye.slice(debut, debut + ELEMENTS_PAR_PAGE_DETAIL);
  }, [congesEmploye, pageConges]);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative size-20 overflow-hidden rounded-2xl border border-[var(--bordure)] bg-[var(--surface-mute)]">
          <Image
            src={urlPhotoProfil(employe.photoUrl, employe.role)}
            alt={`${employe.prenom} ${employe.nom}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">
            {employe.prenom} {employe.nom}
          </h3>
          <Pastille ton={employe.role === "rh" ? "accent" : employe.role === "manager" ? "alerte" : "neutre"}>
            {libelleRole(employe.role)}
          </Pastille>
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-mute)] p-3">
          <Mail className="size-5 text-[var(--accent-principal)]" />
          <div>
            <p className="text-xs text-[var(--texte-secondaire)]">Email</p>
            <p className="text-sm font-medium">{employe.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-mute)] p-3">
          <Building className="size-5 text-[var(--accent-principal)]" />
          <div>
            <p className="text-xs text-[var(--texte-secondaire)]">Departement</p>
            <p className="text-sm font-medium">{employe.departement}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-mute)] p-3">
          <Briefcase className="size-5 text-[var(--accent-principal)]" />
          <div>
            <p className="text-xs text-[var(--texte-secondaire)]">Poste</p>
            <p className="text-sm font-medium">{employe.poste}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-mute)] p-3">
          <Users className="size-5 text-[var(--accent-principal)]" />
          <div>
            <p className="text-xs text-[var(--texte-secondaire)]">Date d&apos;embauche</p>
            <p className="text-sm font-medium">
              {format(new Date(employe.dateEmbauche), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
            <CalendarDays className="size-4 text-[var(--accent-principal)]" />
          </div>
          <h4 className="text-sm font-semibold text-[var(--texte-principal)]">
            Demandes de conges
            {!chargementConges && (
              <span className="ml-1.5 font-normal text-[var(--texte-secondaire)]">
                ({congesEmploye.length})
              </span>
            )}
          </h4>
        </div>
        {chargementConges ? (
          <div className="space-y-2">
            <Squelette className="h-10 w-full rounded-lg" />
            <Squelette className="h-10 w-full rounded-lg" />
          </div>
        ) : congesEmploye.length === 0 ? (
          <p className="flex items-center justify-center rounded-xl border border-[var(--bordure)]/50 bg-[var(--surface-mute)]/50 px-3 py-8 text-2xl font-semibold tabular-nums text-[var(--texte-principal)]">
            {congesEmploye.length}
          </p>
        ) : (
          <>
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete>Type</TableauCelluleEntete>
                  <TableauCelluleEntete>Periode</TableauCelluleEntete>
                  <TableauCelluleEntete>Statut</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {congesPaginees.map((c) => (
                  <TableauRangee key={c.id} className="ligne-liste-luxe">
                    <TableauCellule className="font-medium">{libelleTypeConge(c.type)}</TableauCellule>
                    <TableauCellule className="whitespace-nowrap text-xs">
                      {format(parseISO(c.dateDebut), "d MMM", { locale: fr })} →{" "}
                      {format(parseISO(c.dateFin), "d MMM yyyy", { locale: fr })}
                    </TableauCellule>
                    <TableauCellule>
                      <Pastille ton={pastilleStatutCongeRapide(c.statut)}>{libelleStatutConge(c.statut)}</Pastille>
                    </TableauCellule>
                  </TableauRangee>
                ))}
              </TableauCorps>
            </Tableau>
            <div className="border-t border-[var(--bordure)]/50 pt-4">
              <Pagination
                pageActuelle={pageConges}
                totalPages={Math.max(1, Math.ceil(congesEmploye.length / ELEMENTS_PAR_PAGE_DETAIL))}
                onChangerPage={setPageConges}
                nombreElementsTotal={congesEmploye.length}
                taillePage={ELEMENTS_PAR_PAGE_DETAIL}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end border-t border-[var(--bordure)]/50 pt-4">
        <Bouton variante="secondaire" onClick={onFermer}>
          Fermer
        </Bouton>
      </div>
    </div>
  );
}

export function ListeEmployes() {
  const { data: employes = [], isLoading, isError } = useEmployes();
  const creer = useCreerEmploye();
  const modifier = useModifierEmploye();
  const supprimer = useSupprimerEmploye();

  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState("");
  const [filtreDepartement, setFiltreDepartement] = useState("");
  const [page, setPage] = useState(1);
  const [modeVue, setModeVue] = useState<ModeVue>("tableau");

  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [modeDialogue, setModeDialogue] = useState<"creer" | "modifier" | "detail" | "supprimer">("creer");
  const [employeSelectionne, setEmployeSelectionne] = useState<Employe | null>(null);

  const donneesFiltrees = useMemo(() => {
    return employes.filter((e) => {
      const nomComplet = `${e.prenom} ${e.nom}`.toLowerCase();
      const correspondRecherche =
        nomComplet.includes(recherche.toLowerCase()) ||
        e.email.toLowerCase().includes(recherche.toLowerCase()) ||
        e.poste.toLowerCase().includes(recherche.toLowerCase());
      const correspondRole = !filtreRole || e.role === filtreRole;
      const correspondDepartement = !filtreDepartement || e.departement === filtreDepartement;
      return correspondRecherche && correspondRole && correspondDepartement;
    });
  }, [employes, recherche, filtreRole, filtreDepartement]);

  const donneesPaginees = donneesFiltrees.slice(
    (page - 1) * ELEMENTS_PAR_PAGE,
    page * ELEMENTS_PAR_PAGE
  );

  const handleRecherche = (val: string) => {
    setRecherche(val);
    setPage(1);
  };

  const handleFiltreRole = (val: string) => {
    setFiltreRole(val);
    setPage(1);
  };

  const handleFiltreDepartement = (val: string) => {
    setFiltreDepartement(val);
    setPage(1);
  };

  const ouvrirCreer = () => {
    setEmployeSelectionne(null);
    setModeDialogue("creer");
    setDialogueOuvert(true);
  };

  const ouvrirDetail = (e: Employe) => {
    setEmployeSelectionne(e);
    setModeDialogue("detail");
    setDialogueOuvert(true);
  };

  const ouvrirModifier = (e: Employe) => {
    setEmployeSelectionne(e);
    setModeDialogue("modifier");
    setDialogueOuvert(true);
  };

  const ouvrirSupprimer = (e: Employe) => {
    setEmployeSelectionne(e);
    setModeDialogue("supprimer");
    setDialogueOuvert(true);
  };

  const handleSoumettre = (data: Omit<Employe, "id"> | Employe) => {
    if ("id" in data) {
      modifier.mutate(data as Employe, {
        onSuccess: () => setDialogueOuvert(false),
      });
    } else {
      creer.mutate(data, {
        onSuccess: () => setDialogueOuvert(false),
      });
    }
  };

  const handleSupprimer = () => {
    if (employeSelectionne) {
      supprimer.mutate(employeSelectionne.id, {
        onSuccess: () => setDialogueOuvert(false),
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <EntetePage
        icone={<Users className="size-5 sm:size-6 text-[var(--accent-principal)]" />}
        titre="Annuaire des employes"
        description={
          <>
            {donneesFiltrees.length} membre{donneesFiltrees.length > 1 ? "s" : ""} dans l&apos;organisation
          </>
        }
        actions={
          <Bouton className="w-full gap-2 sm:w-auto" onClick={ouvrirCreer}>
            <Plus className="size-4" />
            Nouvel employe
          </Bouton>
        }
      />

      <Carte>
        <CarteEntete>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CarteTitre>Liste des effectifs</CarteTitre>
              <CarteDescription>
                Identite, role et rattachement de chaque membre de l&apos;equipe.
              </CarteDescription>
            </div>
            <ToggleVue mode={modeVue} onChangerMode={setModeVue} />
          </div>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de filtres et recherche */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={handleRecherche}
              placeholder="Rechercher par nom, email, poste..."
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <FiltreSelect
                valeur={filtreRole}
                onChangerValeur={handleFiltreRole}
                options={optionsRole}
                placeholder="Tous les roles"
                label="Filtrer par role"
                className="w-full sm:w-40"
              />
              <FiltreSelect
                valeur={filtreDepartement}
                onChangerValeur={handleFiltreDepartement}
                options={optionsDepartement}
                placeholder="Tous les departements"
                label="Filtrer par departement"
                className="w-full sm:w-52"
              />
            </div>
          </div>

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
          ) : donneesPaginees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">Aucun employe trouve.</p>
            </div>
          ) : modeVue === "tableau" ? (
            <Tableau>
              <TableauEntete>
                <TableauRangee>
                  <TableauCelluleEntete className="w-16" />
                  <TableauCelluleEntete>Nom complet</TableauCelluleEntete>
                  <TableauCelluleEntete>Email</TableauCelluleEntete>
                  <TableauCelluleEntete>Departement</TableauCelluleEntete>
                  <TableauCelluleEntete>Poste</TableauCelluleEntete>
                  <TableauCelluleEntete>Role</TableauCelluleEntete>
                  <TableauCelluleEntete className="text-right">Actions</TableauCelluleEntete>
                </TableauRangee>
              </TableauEntete>
              <TableauCorps>
                {donneesPaginees.map((e) => (
                  <TableauRangee key={e.id} className="group ligne-liste-luxe">
                    <TableauCellule>
                      <div className="relative size-10 overflow-hidden rounded-xl border border-[var(--bordure)]/50 bg-[var(--surface-mute)] transition-transform group-hover:scale-105">
                        <Image
                          src={urlPhotoProfil(e.photoUrl, e.role)}
                          alt={`${e.prenom} ${e.nom}`}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    </TableauCellule>
                    <TableauCellule>
                      <span className="font-semibold">
                        {e.prenom} {e.nom}
                      </span>
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
                    <TableauCellule>
                      <div className="flex items-center justify-end gap-1">
                        <Bouton variante="fantome" taille="icone" onClick={() => ouvrirDetail(e)} aria-label="Voir detail">
                          <Eye className="size-4" />
                        </Bouton>
                        <Bouton variante="fantome" taille="icone" onClick={() => ouvrirModifier(e)} aria-label="Modifier">
                          <Pencil className="size-4" />
                        </Bouton>
                        <Bouton variante="fantome" taille="icone" onClick={() => ouvrirSupprimer(e)} aria-label="Supprimer">
                          <Trash2 className="size-4 text-[var(--danger)]" />
                        </Bouton>
                      </div>
                    </TableauCellule>
                  </TableauRangee>
                ))}
              </TableauCorps>
            </Tableau>
          ) : (
            <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {donneesPaginees.map((e) => (
                <div
                  key={e.id}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] p-4 transition-all hover:shadow-lg hover:border-[var(--accent-principal)]/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative size-14 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--bordure)]/50 bg-[var(--surface-mute)]">
                      <Image
                        src={urlPhotoProfil(e.photoUrl, e.role)}
                        alt={`${e.prenom} ${e.nom}`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {e.prenom} {e.nom}
                      </h4>
                      <p className="text-sm text-[var(--texte-secondaire)] truncate">{e.poste}</p>
                      <div className="mt-2">
                        <Pastille ton={e.role === "rh" ? "accent" : e.role === "manager" ? "alerte" : "neutre"}>
                          {libelleRole(e.role)}
                        </Pastille>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-xs text-[var(--texte-secondaire)]">
                    <p className="truncate">{e.email}</p>
                    <p>{e.departement}</p>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bouton variante="fantome" taille="icone" onClick={() => ouvrirDetail(e)} aria-label="Voir detail">
                      <Eye className="size-4" />
                    </Bouton>
                    <Bouton variante="fantome" taille="icone" onClick={() => ouvrirModifier(e)} aria-label="Modifier">
                      <Pencil className="size-4" />
                    </Bouton>
                    <Bouton variante="fantome" taille="icone" onClick={() => ouvrirSupprimer(e)} aria-label="Supprimer">
                      <Trash2 className="size-4 text-[var(--danger)]" />
                    </Bouton>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Dialogues */}
      <Dialogue open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
        <ContenuDialogue
          className={
            modeDialogue === "detail"
              ? "max-h-[85vh] max-w-3xl overflow-y-auto"
              : "max-w-xl"
          }
        >
          <EnteteDialogue>
            <TitreDialogue>
              {modeDialogue === "creer" && "Nouvel employe"}
              {modeDialogue === "modifier" && "Modifier l'employe"}
              {modeDialogue === "detail" && "Details de l'employe"}
              {modeDialogue === "supprimer" && "Confirmer la suppression"}
            </TitreDialogue>
          </EnteteDialogue>

          {modeDialogue === "creer" && (
            <FormulaireEmploye
              onSoumettre={handleSoumettre}
              onAnnuler={() => setDialogueOuvert(false)}
              isLoading={creer.isPending}
            />
          )}

          {modeDialogue === "modifier" && employeSelectionne && (
            <FormulaireEmploye
              employe={employeSelectionne}
              onSoumettre={handleSoumettre}
              onAnnuler={() => setDialogueOuvert(false)}
              isLoading={modifier.isPending}
            />
          )}

          {modeDialogue === "detail" && employeSelectionne && (
            <DetailEmploye employe={employeSelectionne} onFermer={() => setDialogueOuvert(false)} />
          )}

          {modeDialogue === "supprimer" && employeSelectionne && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--texte-secondaire)]">
                Etes-vous sur de vouloir supprimer l&apos;employe{" "}
                <span className="font-semibold text-[var(--texte-principal)]">
                  {employeSelectionne.prenom} {employeSelectionne.nom}
                </span>{" "}
                ? Cette action est irreversible.
              </p>
              <PiedDialogue>
                <Bouton variante="secondaire" className="w-full sm:w-auto" onClick={() => setDialogueOuvert(false)}>
                  Annuler
                </Bouton>
                <Bouton
                  className="w-full sm:w-auto"
                  variante="destructif"
                  onClick={handleSupprimer}
                  disabled={supprimer.isPending}
                >
                  {supprimer.isPending ? "Suppression..." : "Supprimer"}
                </Bouton>
              </PiedDialogue>
            </div>
          )}
        </ContenuDialogue>
      </Dialogue>
    </div>
  );
}
