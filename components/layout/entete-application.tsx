"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Bell, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  MenuDeroulant,
  ContenuMenuDeroulant,
  DeclencheurMenuDeroulant,
  ElementMenuDeroulant,
  SeparateurMenuDeroulant,
} from "@/components/ui/dropdown-menu";
import { Bouton } from "@/components/ui/button";
import { Entree } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { magasinApplication } from "@/stores/magasin-application";
import type { IdOnglet } from "@/types";
import { useNotifications, useMarquerNotificationLue } from "@/hooks/queries/use-notifications";
import { formatDistanceToNow } from "date-fns";

const titresPages: Partial<
  Record<
    IdOnglet,
    {
      titre: string;
      sousTitre: string;
    }
  >
> = {
  "tableau-bord": { titre: "Pilotage RH", sousTitre: "Vue consolidée des flux et alertes." },
  employes: { titre: "Annuaire employés", sousTitre: "Profils, affectations et contacts." },
  conges: { titre: "Gestion des congés", sousTitre: "Validation, commentaires et charge d’équipe." },
  "mes-conges": { titre: "Mes congés", sousTitre: "Demandes, calendrier et soldes estimés." },
  documents: { titre: "Documents administratifs", sousTitre: "Production et suivi des pièces RH." },
  "mes-documents": { titre: "Mes documents", sousTitre: "Demandes et pièces à récupérer." },
  "mon-profil": { titre: "Mon profil", sousTitre: "Informations visibles par votre organisation." },
  statistiques: { titre: "Statistiques", sousTitre: "Indicateurs de charge et de traitement." },
  notifications: { titre: "Notifications", sousTitre: "Centre de messages personnels." },
  parametrage: { titre: "Paramétrage", sousTitre: "Référentiels et règles métiers (RH)." },
  parametres: { titre: "Paramètres", sousTitre: "Préférences de session et affichage." },
  absences: { titre: "Absences", sousTitre: "Synthèse des indisponibilités déclarées." },
  historique: { titre: "Historique", sousTitre: "Journal des actions et validations." },
};

export function EnteteApplication({
  margeGauche,
  surMenuMobile,
  surNouvelleDemande,
}: {
  margeGauche: number;
  surMenuMobile: () => void;
  surNouvelleDemande?: () => void;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const ongletActif = magasinApplication((s) => s.ongletActif);
  const deconnecter = magasinApplication((s) => s.deconnecter);
  const definirOngletActif = magasinApplication((s) => s.definirOngletActif);
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const marquerLue = useMarquerNotificationLue();

  const entete = useMemo(() => {
    const defaut = { titre: "MUFER Employés", sousTitre: "" };
    return titresPages[ongletActif] ?? defaut;
  }, [ongletActif]);

  const apercu = notifications.slice(0, 5);

  if (!utilisateur) return null;

  const roleLibelle = utilisateur.role === "rh" ? "RH" : utilisateur.role === "manager" ? "Manager" : "Employe";

  return (
    <motion.header
      layout
      className="fixed top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--bordure)]/50 bg-[var(--surface-elevee)]/90 px-4 shadow-sm backdrop-blur-xl sm:px-6"
      style={{ left: margeGauche, right: 0 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Bouton
          variante="fantome"
          taille="icone"
          className="lg:hidden"
          onClick={surMenuMobile}
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </Bouton>
        <div className="min-w-0">
          <motion.h1
            key={ongletActif}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="truncate text-lg font-bold tracking-tight"
          >
            {entete.titre}
          </motion.h1>
          {entete.sousTitre && (
            <p className="hidden text-xs text-[var(--texte-secondaire)] sm:block">
              {entete.sousTitre}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-[var(--bordure)]/50 bg-[var(--surface-mute)]/40 px-3 py-1.5 lg:flex">
          <span className="text-xs font-medium text-[var(--texte-secondaire)]">
            {format(new Date(), "EEEE d MMMM", { locale: fr })}
          </span>
        </div>

        <div
          className={`flex items-center overflow-hidden rounded-lg transition-all ${rechercheOuverte ? "max-w-[200px] border border-[var(--bordure)]/50 bg-[var(--surface-mute)]/40" : "max-w-9"}`}
        >
          <Bouton
            variante="fantome"
            taille="icone"
            onClick={() => setRechercheOuverte((v) => !v)}
            aria-label="Recherche"
            className="size-9"
          >
            <Search className="size-4" />
          </Bouton>
          {rechercheOuverte && (
            <Entree placeholder="Rechercher..." className="h-8 w-[140px] border-0 bg-transparent text-xs shadow-none focus-visible:ring-0" />
          )}
        </div>

        {(ongletActif === "conges" ||
          ongletActif === "mes-conges" ||
          ongletActif === "documents" ||
          ongletActif === "mes-documents") &&
          utilisateur.role !== "rh" && (
            <Bouton taille="sm" onClick={surNouvelleDemande} className="hidden gap-1.5 sm:inline-flex">
              <Plus className="size-4" />
              <span>Nouvelle demande</span>
            </Bouton>
          )}

        <MenuDeroulant>
          <DeclencheurMenuDeroulant asChild>
            <Bouton variante="fantome" taille="icone" className="relative size-9" aria-label="Notifications">
              <Bell className="size-4" />
              {notifications.some((n) => !n.lue) && (
                <span className="absolute right-1.5 top-1.5 size-2 animate-pulse rounded-full bg-[var(--danger)]" />
              )}
            </Bouton>
          </DeclencheurMenuDeroulant>
          <ContenuMenuDeroulant align="end" className="w-80 rounded-xl border-[var(--bordure)]/50 shadow-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold">Notifications</span>
              {notifications.some((n) => !n.lue) && (
                <span className="rounded-full bg-[var(--danger)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--danger)]">
                  {notifications.filter((n) => !n.lue).length} nouvelles
                </span>
              )}
            </div>
            <SeparateurMenuDeroulant />
            {apercu.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--texte-secondaire)]">Aucune notification</p>
            ) : (
              apercu.map((n) => (
                <ElementMenuDeroulant
                  key={n.id}
                  className="flex flex-col items-start gap-1 whitespace-normal px-3 py-2"
                  onClick={() => marquerLue.mutate(n.id)}
                >
                  <span className="text-sm font-medium">{n.titre}</span>
                  <span className="text-xs text-[var(--texte-secondaire)]">{n.message}</span>
                  <span className="text-[10px] text-[var(--texte-secondaire)]/70">
                    {formatDistanceToNow(new Date(n.creeLe), { addSuffix: true, locale: fr })}
                  </span>
                </ElementMenuDeroulant>
              ))
            )}
            <SeparateurMenuDeroulant />
            <ElementMenuDeroulant
              onClick={() => {
                definirOngletActif("notifications");
                router.replace("/?page=notifications");
              }}
              className="justify-center text-sm font-medium text-[var(--accent-principal)]"
            >
              Voir toutes les notifications
            </ElementMenuDeroulant>
          </ContenuMenuDeroulant>
        </MenuDeroulant>

        <Bouton
          variante="fantome"
          taille="icone"
          className="relative size-9"
          aria-label="Basculer le theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Bouton>

        <MenuDeroulant>
          <DeclencheurMenuDeroulant asChild>
            <button
              type="button"
              className="group flex items-center gap-2.5 rounded-xl border border-[var(--bordure)]/50 bg-[var(--surface-mute)]/30 px-2 py-1.5 transition-all hover:border-[var(--bordure)] hover:bg-[var(--surface-mute)]/50"
            >
              <Avatar className="size-8 ring-2 ring-[var(--surface-elevee)]">
                {utilisateur.photoUrl ? <AvatarImage src={utilisateur.photoUrl} alt="" /> : null}
                <AvatarFallback className="bg-[var(--accent-principal)]/15 text-xs font-semibold text-[var(--accent-principal)]">
                  {utilisateur.prenom[0]}
                  {utilisateur.nom[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <div className="text-sm font-medium leading-tight">{utilisateur.prenom}</div>
                <div className="text-[10px] font-medium text-[var(--texte-secondaire)]">{roleLibelle}</div>
              </div>
            </button>
          </DeclencheurMenuDeroulant>
          <ContenuMenuDeroulant align="end" className="w-48 rounded-xl border-[var(--bordure)]/50 shadow-xl">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{utilisateur.prenom} {utilisateur.nom}</p>
              <p className="text-xs text-[var(--texte-secondaire)]">{utilisateur.departement}</p>
            </div>
            <SeparateurMenuDeroulant />
            <ElementMenuDeroulant
              onClick={() => {
                definirOngletActif("mon-profil");
                router.replace("/?page=mon-profil");
              }}
            >
              Mon profil
            </ElementMenuDeroulant>
            <ElementMenuDeroulant
              onClick={() => {
                definirOngletActif("parametres");
                router.replace("/?page=parametres");
              }}
            >
              Parametres
            </ElementMenuDeroulant>
            <SeparateurMenuDeroulant />
            <ElementMenuDeroulant
              onClick={() => {
                deconnecter();
                router.replace("/login");
              }}
              className="text-[var(--danger)]"
            >
              Deconnexion
            </ElementMenuDeroulant>
          </ContenuMenuDeroulant>
        </MenuDeroulant>
      </div>
    </motion.header>
  );
}
