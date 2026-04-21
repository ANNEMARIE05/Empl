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

  return (
    <motion.header
      layout
      className="fixed top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--bordure)]/80 bg-[var(--surface-elevee)]/85 px-3 backdrop-blur-xl sm:px-5"
      style={{ left: margeGauche, right: 0 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
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
            className="truncate text-base font-semibold tracking-tight sm:text-lg"
          >
            {entete.titre}
          </motion.h1>
          {entete.sousTitre ? (
            <p className="hidden text-[11px] text-[var(--texte-secondaire)] sm:block sm:text-xs">
              {entete.sousTitre}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="puce-donnee hidden lg:inline-flex">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </span>

        <div
          className={`flex items-center overflow-hidden transition-all ${rechercheOuverte ? "max-w-[200px]" : "max-w-9"}`}
        >
          <Bouton
            variante="fantome"
            taille="icone"
            onClick={() => setRechercheOuverte((v) => !v)}
            aria-label="Recherche"
          >
            <Search className="size-4" />
          </Bouton>
          {rechercheOuverte && (
            <Entree placeholder="Rechercher…" className="ml-1 h-8 w-[140px] text-xs" />
          )}
        </div>

        {(ongletActif === "conges" ||
          ongletActif === "mes-conges" ||
          ongletActif === "documents" ||
          ongletActif === "mes-documents") &&
          utilisateur.role !== "rh" && (
            <Bouton taille="sm" onClick={surNouvelleDemande} className="hidden sm:inline-flex">
              <Plus className="size-4" />
              Nouvelle demande
            </Bouton>
          )}

        <MenuDeroulant>
          <DeclencheurMenuDeroulant asChild>
            <Bouton variante="fantome" taille="icone" className="relative" aria-label="Notifications">
              <Bell className="size-4" />
              {notifications.some((n) => !n.lue) && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-[var(--danger)]" />
              )}
            </Bouton>
          </DeclencheurMenuDeroulant>
          <ContenuMenuDeroulant align="end" className="w-80">
            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--texte-secondaire)]">
              Notifications
            </div>
            <SeparateurMenuDeroulant />
            {apercu.length === 0 ? (
              <p className="px-2 py-3 text-sm text-[var(--texte-secondaire)]">Aucune notification.</p>
            ) : (
              apercu.map((n) => (
                <ElementMenuDeroulant
                  key={n.id}
                  className="flex flex-col items-start gap-1 whitespace-normal"
                  onClick={() => marquerLue.mutate(n.id)}
                >
                  <span className="text-xs font-medium">{n.titre}</span>
                  <span className="text-[11px] text-[var(--texte-secondaire)]">{n.message}</span>
                  <span className="text-[10px] text-[var(--texte-secondaire)]/80">
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
            >
              Tout afficher
            </ElementMenuDeroulant>
          </ContenuMenuDeroulant>
        </MenuDeroulant>

        <Bouton
          variante="fantome"
          taille="icone"
          className="relative"
          aria-label="Basculer le thème"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Bouton>

        <MenuDeroulant>
          <DeclencheurMenuDeroulant asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-[var(--rayon-md)] border border-[var(--bordure)]/80 bg-[var(--surface-mute)]/40 px-2 py-1"
            >
              <div className="hidden text-right text-xs sm:block">
                <div className="font-medium">{utilisateur.prenom}</div>
                <div className="text-[10px] text-[var(--texte-secondaire)]">{utilisateur.departement}</div>
              </div>
              <Avatar className="size-8">
                {utilisateur.photoUrl ? <AvatarImage src={utilisateur.photoUrl} alt="" /> : null}
                <AvatarFallback>
                  {utilisateur.prenom[0]}
                  {utilisateur.nom[0]}
                </AvatarFallback>
              </Avatar>
            </button>
          </DeclencheurMenuDeroulant>
          <ContenuMenuDeroulant align="end">
            <ElementMenuDeroulant
              onClick={() => {
                definirOngletActif("mon-profil");
                router.replace("/?page=mon-profil");
              }}
            >
              Mon profil
            </ElementMenuDeroulant>
            <SeparateurMenuDeroulant />
            <ElementMenuDeroulant
              onClick={() => {
                deconnecter();
                router.replace("/login");
              }}
            >
              Déconnexion
            </ElementMenuDeroulant>
          </ContenuMenuDeroulant>
        </MenuDeroulant>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-principal)]/35 to-transparent" />
    </motion.header>
  );
}
