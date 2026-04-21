"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <Carte className="overflow-hidden border-[var(--bordure)]/80 p-0">
          <div className="grid md:grid-cols-2">
            <div className="relative h-56 md:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="space-y-3 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-principal)]">
                Espace personnel
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Bonjour {utilisateur.prenom}, voici votre vue simplifiée.
              </h2>
              <p className="text-sm text-[var(--texte-secondaire)]">
                Pas d’accès aux statistiques globales ni à l’annuaire complet : uniquement vos demandes et documents.
              </p>
            </div>
          </div>
        </Carte>

        <div className="grid gap-4">
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <Carte>
              <CarteEntete>
                <CarteTitre>Suivi congés</CarteTitre>
                <CarteDescription>Demandes actives ou validées vous concernant.</CarteDescription>
              </CarteEntete>
              <CarteContenu>
                <p className="text-4xl font-semibold">
                  <NombreAnime valeur={prochains} />
                </p>
              </CarteContenu>
            </Carte>
          </motion.div>
          <Carte>
            <CarteEntete>
              <CarteTitre>Documents</CarteTitre>
              <CarteDescription>Pièces suivies dans votre dossier.</CarteDescription>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-semibold">
                <NombreAnime valeur={documents.length} />
              </p>
            </CarteContenu>
          </Carte>
        </div>
      </div>
    </div>
  );
}
