"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, FileText, Info } from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";
import { magasinApplication } from "@/stores/magasin-application";

export function TableauBordEmploye() {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const { data: conges = [] } = useConges();
  const { data: documents = [] } = useDocuments();

  const prochains = conges.filter((c) => c.statut === "en_attente" || c.statut === "valide").length;

  if (!utilisateur) return null;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[var(--bordure)]/50 bg-gradient-to-r from-[var(--accent-principal)]/10 via-transparent to-[var(--accent-principal)]/5">
        <div className="grid md:grid-cols-2">
          <div className="relative h-48 md:h-auto md:min-h-[200px]">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--surface-racine)]" />
          </div>
          <div className="flex flex-col justify-center space-y-4 p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-principal)]/30 bg-[var(--accent-principal)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-principal)]">
              <span className="size-1.5 rounded-full bg-[var(--accent-principal)]" />
              Espace personnel
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Bonjour {utilisateur.prenom}
            </h2>
            <p className="text-sm text-[var(--texte-secondaire)] leading-relaxed">
              Bienvenue dans votre espace employe. Consultez vos demandes de conges et vos documents administratifs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                  <CalendarDays className="size-5 text-[var(--accent-principal)]" />
                </div>
                <div>
                  <CarteTitre>Mes conges</CarteTitre>
                  <CarteDescription>Demandes en cours</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-[var(--accent-principal)]">
                <NombreAnime valeur={prochains} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <FileText className="size-5 text-emerald-600" />
                </div>
                <div>
                  <CarteTitre>Mes documents</CarteTitre>
                  <CarteDescription>Pieces administratives</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-emerald-600">
                <NombreAnime valeur={documents.length} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full border-dashed">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface-mute)]">
                  <Info className="size-5 text-[var(--texte-secondaire)]" />
                </div>
                <div>
                  <CarteTitre>Acces restreint</CarteTitre>
                  <CarteDescription>Vue simplifiee</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-sm text-[var(--texte-secondaire)] leading-relaxed">
                Certaines fonctionnalites sont reservees aux responsables RH.
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>
    </div>
  );
}
