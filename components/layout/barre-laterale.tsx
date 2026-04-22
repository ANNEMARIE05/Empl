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
import { ImageProfilUtilisateur } from "@/components/ui/image-profil-utilisateur";
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
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/5 bg-gradient-to-b from-[var(--barre-laterale)] to-[#0a0a0a] text-[var(--barre-laterale-texte)] transition-[width] duration-300",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 border-b border-white/5",
          menuOuvert
            ? "h-16 flex-row items-center gap-3 px-4"
            : "flex-col items-center gap-2 py-3 px-2",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--barre-laterale-accent)] to-[var(--barre-laterale-accent)]/80 text-sm font-black text-[var(--texte-sur-accent)] shadow-lg shadow-[var(--barre-laterale-accent)]/20",
            menuOuvert ? "size-10" : "size-9",
          )}
        >
          M
        </div>
        {menuOuvert && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold tracking-tight">MUFER</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--barre-laterale-accent)]">
              EMPLOYES
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => basculerMenu()}
          className={cn(
            "hidden rounded-lg border text-[var(--barre-laterale-texte)] transition-colors lg:inline-flex",
            menuOuvert
              ? "ml-auto border-white/10 bg-white/5 p-1.5 hover:bg-white/10"
              : "border-[var(--barre-laterale-accent)]/40 bg-[var(--barre-laterale-accent)]/25 p-2 text-[var(--barre-laterale-accent)] shadow-md shadow-black/20 hover:border-[var(--barre-laterale-accent)]/60 hover:bg-[var(--barre-laterale-accent)]/35",
          )}
          aria-label={menuOuvert ? "Replier le menu" : "Deplier le menu"}
        >
          {menuOuvert ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      </div>

      <nav className="defilement-barre-laterale flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {menuOuvert && (
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Menu principal
          </p>
        )}
        <div className="space-y-1">
          {menu.map((el) => {
            const actif = ongletActif === el.id;
            return (
              <button
                key={el.id}
                type="button"
                onClick={() => aller(el.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                  actif
                    ? "bg-gradient-to-r from-[var(--barre-laterale-accent)]/20 to-transparent text-[var(--barre-laterale-accent)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90",
                )}
              >
                {actif && (
                  <motion.span
                    layoutId="indicateur-menu"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[var(--barre-laterale-accent)]"
                  />
                )}
                <span className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-lg transition-colors",
                  actif ? "bg-[var(--barre-laterale-accent)]/20" : "bg-white/5 group-hover:bg-white/10"
                )}>
                  {icones[el.id]}
                </span>
                {menuOuvert && (
                  <span className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate">{el.libelle}</span>
                    {el.id === "notifications" && nonLues > 0 && (
                      <span className="rounded-full bg-[var(--danger)] px-2 py-0.5 text-[10px] font-bold text-white">
                        {nonLues > 9 ? "9+" : nonLues}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {menuOuvert && (
          <p className="mb-2 mt-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Configuration
          </p>
        )}
        <div className="space-y-1">
          {secondaire.map((el) => {
            const actif = ongletActif === el.id;
            return (
              <button
                key={el.id}
                type="button"
                onClick={() => aller(el.id)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                  actif
                    ? "bg-gradient-to-r from-[var(--barre-laterale-accent)]/20 to-transparent text-[var(--barre-laterale-accent)]"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80",
                )}
              >
                <span className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-colors",
                  actif ? "bg-[var(--barre-laterale-accent)]/20" : "bg-white/5"
                )}>
                  {icones[el.id]}
                </span>
                {menuOuvert && <span className="truncate">{el.libelle}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className={cn("flex items-center gap-3 rounded-xl bg-white/5 p-2", !menuOuvert && "flex-col bg-transparent p-0")}>
          <ImageProfilUtilisateur
            photoUrl={utilisateur.photoUrl}
            role={utilisateur.role}
            prenom={utilisateur.prenom}
            nom={utilisateur.nom}
            taille="md"
            className="ring-2 ring-white/10"
          />
          {menuOuvert && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {utilisateur.prenom} {utilisateur.nom}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <Pastille
                  ton={
                    utilisateur.role === "rh"
                      ? "accent"
                      : utilisateur.role === "manager"
                        ? "alerte"
                        : "neutre"
                  }
                  className="text-[9px]"
                >
                  {libelleRole(utilisateur.role)}
                </Pastille>
              </div>
            </div>
          )}
        </div>
        <Bouton
          variante="secondaire"
          className="mt-3 w-full border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
          onClick={() => setConfirmerSortie(true)}
        >
          <LogOut className="size-4" />
          {menuOuvert && "Deconnexion"}
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
                      <nav className="defilement-barre-laterale flex-1 space-y-4 overflow-y-auto px-2 py-3">
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
                        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-2">
                          <ImageProfilUtilisateur
                            photoUrl={utilisateur.photoUrl}
                            role={utilisateur.role}
                            prenom={utilisateur.prenom}
                            nom={utilisateur.nom}
                            taille="md"
                            className="ring-2 ring-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {utilisateur.prenom} {utilisateur.nom}
                            </p>
                            <Pastille
                              ton={
                                utilisateur.role === "rh"
                                  ? "accent"
                                  : utilisateur.role === "manager"
                                    ? "alerte"
                                    : "neutre"
                              }
                              className="mt-1 text-[9px]"
                            >
                              {libelleRole(utilisateur.role)}
                            </Pastille>
                          </div>
                        </div>
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
        <ContenuDialogue className="max-w-md">
          <EnteteDialogue>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-red-500/15">
                <LogOut className="size-6 text-red-500" />
              </div>
              <div>
                <TitreDialogue>Confirmer la deconnexion</TitreDialogue>
                <p className="mt-1 text-sm text-[var(--texte-secondaire)]">
                  Vous allez quitter votre session
                </p>
              </div>
            </div>
          </EnteteDialogue>
          
          <div className="my-4 rounded-xl bg-[var(--surface-mute)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-principal)]/15">
                <span className="text-sm font-semibold text-[var(--accent-principal)]">
                  {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-[var(--texte-principal)]">
                  {utilisateur?.prenom} {utilisateur?.nom}
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {utilisateur?.email}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-[var(--texte-secondaire)]">
            Etes-vous sur de vouloir vous deconnecter ? Vous devrez vous reconnecter pour acceder a votre espace.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
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
              <LogOut className="size-4" />
              Se deconnecter
            </Bouton>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </>
  );
}
