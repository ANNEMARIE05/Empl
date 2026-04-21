"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton } from "@/components/ui/button";
import { Entree } from "@/components/ui/input";
import { Etiquette } from "@/components/ui/label";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { FondApplicationDecor } from "@/components/deco/fond-application";
import { magasinApplication } from "@/stores/magasin-application";

export function FormulaireConnexion() {
  const router = useRouter();
  const connecter = magasinApplication((s) => s.connecter);
  const [email, setEmail] = useState("marie.dubois@entreprise.fr");
  const [motDePasse, setMotDePasse] = useState("demo123");
  const [erreur, setErreur] = useState<string | null>(null);
  const [charge, setCharge] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setCharge(true);
    try {
      await connecter(email, motDePasse);
      router.replace("/?page=tableau-bord");
      window.scrollTo(0, 0);
    } catch {
      setErreur("Email ou mot de passe incorrect.");
    } finally {
      setCharge(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FondApplicationDecor />
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1520607162513-77705c0f7d83?auto=format&fit=crop&w=1400&q=80"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/35 to-transparent" />
          <div className="absolute bottom-10 left-10 max-w-md text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--accent-principal)]">
              MUFER
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Une RH fluide, humaine, précise.</h2>
            <p className="mt-3 text-sm text-white/75">
              Congés, documents et indicateurs réunis dans une interface pensée pour les équipes terrain comme
              les sièges sociaux.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--accent-principal)]">
                Employés
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Connexion sécurisée</h1>
              <p className="mt-2 text-sm text-[var(--texte-secondaire)]">
                Démo : mot de passe <span className="font-mono text-[var(--texte-principal)]">demo123</span>. Email
                contenant <span className="font-medium">admin</span> ou <span className="font-medium">marie</span> →
                RH ; <span className="font-medium">manager</span> → manager ; sinon employé.
              </p>
            </div>

            <Carte className="surface-verre">
              <CarteEntete>
                <CarteTitre>Accéder à l’espace</CarteTitre>
                <CarteDescription>Authentification simulée via API Next.</CarteDescription>
              </CarteEntete>
              <CarteContenu>
                <form className="space-y-4" onSubmit={soumettre}>
                  <div className="space-y-2">
                    <Etiquette htmlFor="email">Adresse e-mail</Etiquette>
                    <Entree
                      id="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="mdp">Mot de passe</Etiquette>
                    <Entree
                      id="mdp"
                      type="password"
                      autoComplete="current-password"
                      value={motDePasse}
                      onChange={(e) => setMotDePasse(e.target.value)}
                      required
                    />
                  </div>
                  {erreur ? <p className="text-sm text-[var(--danger)]">{erreur}</p> : null}
                  <Bouton type="submit" className="w-full" disabled={charge}>
                    {charge ? "Connexion…" : "Se connecter"}
                  </Bouton>
                </form>
              </CarteContenu>
            </Carte>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
