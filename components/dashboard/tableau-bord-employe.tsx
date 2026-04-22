"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CalendarDays, CalendarOff, FileText } from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";
import { urlBanniereTableauBord } from "@/lib/url-banniere-dashboard";
import { magasinApplication } from "@/stores/magasin-application";

export function TableauBordEmploye() {
  const router = useRouter();
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const { data: conges = [] } = useConges();
  const { data: documents = [] } = useDocuments();

  const prochains = conges.filter((c) => c.statut === "en_attente" || c.statut === "valide").length;

  if (!utilisateur) return null;

  const imageHero = urlBanniereTableauBord(utilisateur.role);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="overflow-hidden rounded-xl border border-[var(--bordure)]/50 bg-gradient-to-r from-[var(--accent-principal)]/10 via-transparent to-[var(--accent-principal)]/5 dark:from-[var(--accent-principal)]/14 dark:via-transparent dark:to-[var(--accent-principal)]/6 sm:rounded-2xl">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[160px] w-full sm:min-h-[200px] md:min-h-[240px]">
            <img
              src={imageHero}
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover object-center"
              width={1200}
              height={800}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--surface-racine)]" />
          </div>
          <div className="flex flex-col justify-center space-y-2 p-4 sm:space-y-4 sm:p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-principal)]/30 bg-[var(--accent-principal)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-principal)] sm:px-3 sm:py-1 sm:text-[11px]">
              <span className="size-1.5 rounded-full bg-[var(--accent-principal)]" />
              Espace personnel
            </div>
            <h2 className="text-lg font-bold tracking-tight sm:text-2xl md:text-3xl">
              Bonjour {utilisateur.prenom}
            </h2>
            <p className="text-xs text-[var(--texte-secondaire)] leading-relaxed sm:text-sm">
              Bienvenue dans votre espace employe. Consultez vos conges, declarez une absence et accedez a vos documents administratifs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-4">
        <motion.div
          className="min-w-0"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="relative h-full min-w-0 overflow-hidden">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent-principal)]/20 blur-2xl dark:bg-[var(--accent-principal)]/22" />
            <CarteEntete>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-principal)]/15 sm:size-10 sm:rounded-xl dark:bg-[var(--accent-principal)]/18">
                  <CalendarDays className="size-4 text-[var(--accent-principal)] sm:size-5" />
                </div>
                <div className="min-w-0">
                  <CarteTitre>Mes conges</CarteTitre>
                  <CarteDescription>Demandes en cours</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-xl font-bold text-[var(--accent-principal)] sm:text-4xl">
                <NombreAnime valeur={prochains} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full min-w-0">
            <CarteEntete>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 sm:size-10 sm:rounded-xl dark:bg-[var(--accent-principal)]/18">
                  <FileText className="size-4 text-emerald-600 sm:size-5 dark:text-[var(--accent-principal)]" />
                </div>
                <div className="min-w-0">
                  <CarteTitre>Mes documents</CarteTitre>
                  <CarteDescription>Pieces administratives</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-xl font-bold text-emerald-600 dark:text-[var(--accent-principal)] sm:text-4xl">
                <NombreAnime valeur={documents.length} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="col-span-2 min-w-0 sm:col-span-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="relative h-full min-w-0 overflow-hidden">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/15 blur-2xl dark:bg-[var(--accent-principal)]/18" />
            <CarteEntete>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 sm:size-10 sm:rounded-xl dark:bg-[var(--accent-principal)]/18">
                  <CalendarOff className="size-4 text-amber-700 sm:size-5 dark:text-[var(--accent-principal)]" />
                </div>
                <div className="min-w-0">
                  <CarteTitre>Absences</CarteTitre>
                  <CarteDescription>Declaration aupres des RH</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu className="space-y-2 sm:space-y-3">
              <p className="text-xs text-[var(--texte-secondaire)] leading-relaxed sm:text-sm">
                Signalez une indisponibilite (RTT, maladie, teletravail exceptionnel, etc.).
              </p>
              <Bouton
                type="button"
                className="w-full sm:w-auto"
                onClick={() => router.replace("/?page=formulaire-absence")}
              >
                Faire une demande d&apos;absence
              </Bouton>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>
    </div>
  );
}
