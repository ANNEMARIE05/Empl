"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileStack,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialogue,
  ContenuDialogue,
  EnteteDialogue,
  TitreDialogue,
} from "@/components/ui/dialog";
import { Bouton } from "@/components/ui/button";
import { Pastille } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  elementsMenuPrincipal,
  elementsMenuSecondaire,
  filtrerMenuParRole,
} from "@/lib/permissions-menu";
import { cn } from "@/lib/utils";
import { magasinApplication } from "@/stores/magasin-application";
import type { IdOnglet } from "@/types";
import { useNotifications } from "@/hooks/queries/use-notifications";

const icones: Record<string, React.ReactNode> = {
  "tableau-bord": <LayoutDashboard className="size-4" />,
  "mon-profil": <User className="size-4" />,
  "mes-conges": <CalendarDays className="size-4" />,
  absences: <ClipboardList className="size-4" />,
  "mes-documents": <FileStack className="size-4" />,
  employes: <Users className="size-4" />,
  conges: <CalendarDays className="size-4" />,
  documents: <FileStack className="size-4" />,
  statistiques: <BarChart3 className="size-4" />,
  notifications: <Bell className="size-4" />,
  historique: <History className="size-4" />,
  parametrage: <SlidersHorizontal className="size-4" />,
  parametres: <Settings className="size-4" />,
};

function libelleRole(role: string) {
  if (role === "rh") return "RH";
  if (role === "manager") return "Manager";
  return "Employé";
}

export function BarreLaterale({
  mobileOuverte,
  surFermerMobile,
}: {
  mobileOuverte: boolean;
  surFermerMobile: () => void;
}) {
  const router = useRouter();
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const menuOuvert = magasinApplication((s) => s.menuOuvert);
  const basculerMenu = magasinApplication((s) => s.basculerMenu);
  const ongletActif = magasinApplication((s) => s.ongletActif);
  const definirOngletActif = magasinApplication((s) => s.definirOngletActif);
  const deconnecter = magasinApplication((s) => s.deconnecter);
  const [confirmerSortie, setConfirmerSortie] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const nonLues = notifications.filter((n) => !n.lue).length;

  if (!utilisateur) return null;

  const menu = filtrerMenuParRole(elementsMenuPrincipal, utilisateur.role);
  const secondaire = filtrerMenuParRole(elementsMenuSecondaire, utilisateur.role);

  const largeur = menuOuvert ? 260 : 72;

  const aller = (id: IdOnglet) => {
    definirOngletActif(id);
    router.replace(`/?page=${id}`);
    surFermerMobile();
  };

  const contenuBarre = (
    <aside
      style={{ width: largeur }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-[var(--bordure)]/80 bg-[var(--barre-laterale)] text-[var(--barre-laterale-texte)] backdrop-blur-xl transition-[width] duration-300",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--rayon-sm)] bg-[var(--barre-laterale-accent)] text-[var(--texte-sur-accent)] text-sm font-black">
          M
        </div>
        {menuOuvert && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">MUFER</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--barre-laterale-accent)]">
              Employés
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => basculerMenu()}
          className="ml-auto hidden rounded-[var(--rayon-sm)] border border-white/10 p-1.5 text-[var(--barre-laterale-texte)] hover:bg-white/5 lg:inline-flex"
          aria-label={menuOuvert ? "Replier le menu" : "Déplier le menu"}
        >
          {menuOuvert ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {menu.map((el) => {
            const actif = ongletActif === el.id;
            return (
              <button
                key={el.id}
                type="button"
                onClick={() => aller(el.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-[var(--rayon-md)] px-2.5 py-2 text-left text-sm font-medium transition-colors",
                  actif
                    ? "bg-white/10 text-[var(--barre-laterale-accent)]"
                    : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
              >
                {actif && (
                  <motion.span
                    layoutId="indicateur-menu"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[var(--barre-laterale-accent)]"
                  />
                )}
                <span className="relative z-10 flex size-8 items-center justify-center rounded-[var(--rayon-sm)] border border-white/10 bg-black/20">
                  {icones[el.id]}
                </span>
                {menuOuvert && (
                  <span className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate">{el.libelle}</span>
                    {el.id === "notifications" && nonLues > 0 && (
                      <span className="rounded-[var(--rayon-sm)] bg-[var(--danger)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {nonLues > 9 ? "9+" : nonLues}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="space-y-1 border-t border-white/10 pt-4">
          {secondaire.map((el) => {
            const actif = ongletActif === el.id;
            return (
              <button
                key={el.id}
                type="button"
                onClick={() => aller(el.id)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-[var(--rayon-md)] px-2.5 py-2 text-left text-sm font-medium transition-colors",
                  actif ? "bg-white/10 text-[var(--barre-laterale-accent)]" : "text-white/55 hover:bg-white/5",
                )}
              >
                <span className="flex size-8 items-center justify-center rounded-[var(--rayon-sm)] border border-white/10 bg-black/20">
                  {icones[el.id]}
                </span>
                {menuOuvert && <span className="truncate">{el.libelle}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className={cn("flex items-center gap-3", !menuOuvert && "flex-col")}>
          <Avatar className="size-10 border border-white/15">
            {utilisateur.photoUrl ? (
              <AvatarImage src={utilisateur.photoUrl} alt="" />
            ) : null}
            <AvatarFallback>
              {utilisateur.prenom[0]}
              {utilisateur.nom[0]}
            </AvatarFallback>
          </Avatar>
          {menuOuvert && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {utilisateur.prenom} {utilisateur.nom}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                <Pastille
                  ton={
                    utilisateur.role === "rh"
                      ? "accent"
                      : utilisateur.role === "manager"
                        ? "alerte"
                        : "neutre"
                  }
                >
                  {libelleRole(utilisateur.role)}
                </Pastille>
                <span className="text-[10px] text-white/50">{utilisateur.poste}</span>
              </div>
            </div>
          )}
        </div>
        <Bouton
          variante="secondaire"
          className="mt-3 w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          onClick={() => setConfirmerSortie(true)}
        >
          <LogOut className="size-4" />
          {menuOuvert && "Déconnexion"}
        </Bouton>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{contenuBarre}</div>
      <AnimatePresence>
        {mobileOuverte && (
          <>
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={surFermerMobile}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-16 z-40 h-[calc(100%-4rem)] lg:hidden"
            >
              <div className="h-full w-[260px] overflow-hidden rounded-r-[var(--rayon-lg)] border border-[var(--bordure)] shadow-xl">
                <div className="h-full bg-[var(--barre-laterale)] text-[var(--barre-laterale-texte)]">
                  {/* re-use nav by extracting - simplified: inline duplicate width */}
                  <aside className="flex h-full w-[260px] flex-col">
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
                        {menu.map((el) => {
                          const actif = ongletActif === el.id;
                          return (
                            <button
                              key={el.id}
                              type="button"
                              onClick={() => aller(el.id)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-[var(--rayon-md)] px-2 py-2 text-sm",
                                actif ? "bg-white/10 text-[var(--barre-laterale-accent)]" : "text-white/70",
                              )}
                            >
                              {icones[el.id]}
                              <span className="truncate">{el.libelle}</span>
                            </button>
                          );
                        })}
                        {secondaire.map((el) => (
                          <button
                            key={el.id}
                            type="button"
                            onClick={() => aller(el.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-[var(--rayon-md)] px-2 py-2 text-sm",
                              ongletActif === el.id
                                ? "bg-white/10 text-[var(--barre-laterale-accent)]"
                                : "text-white/60",
                            )}
                          >
                            {icones[el.id]}
                            {el.libelle}
                          </button>
                        ))}
                      </nav>
                      <div className="border-t border-white/10 p-3">
                        <Bouton
                          variante="secondaire"
                          className="w-full border-white/15 bg-white/5 text-white"
                          onClick={() => setConfirmerSortie(true)}
                        >
                          <LogOut className="size-4" />
                          Déconnexion
                        </Bouton>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Dialogue open={confirmerSortie} onOpenChange={setConfirmerSortie}>
        <ContenuDialogue>
          <EnteteDialogue>
            <TitreDialogue>Quitter la session ?</TitreDialogue>
          </EnteteDialogue>
          <div className="flex justify-end gap-2">
            <Bouton variante="secondaire" onClick={() => setConfirmerSortie(false)}>
              Annuler
            </Bouton>
            <Bouton
              variante="destructif"
              onClick={() => {
                deconnecter();
                setConfirmerSortie(false);
                router.replace("/login");
              }}
            >
              Déconnexion
            </Bouton>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </>
  );
}
