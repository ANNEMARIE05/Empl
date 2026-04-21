"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, UserCircle } from "lucide-react";
import { Bouton } from "@/components/ui/button";
import { Entree } from "@/components/ui/input";
import { Etiquette } from "@/components/ui/label";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { FondApplicationDecor } from "@/components/deco/fond-application";
import { magasinApplication } from "@/stores/magasin-application";

export function FormulaireConnexion() {
  const router = useRouter();
  const connecter = magasinApplication((s) => s.connecter);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
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

  const connexionDemo = async (type: "rh" | "employe") => {
    setErreur(null);
    setCharge(true);
    try {
      const emailDemo = type === "rh" ? "rh@entreprise.fr" : "employe@entreprise.fr";
      await connecter(emailDemo, "demo123");
      router.replace("/?page=tableau-bord");
      window.scrollTo(0, 0);
    } catch {
      setErreur("Erreur lors de la connexion demo.");
    } finally {
      setCharge(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FondApplicationDecor />
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1520607162513-77705c0f7d83?auto=format&fit=crop&w=1400&q=80"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 max-w-lg text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-principal)] backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-[var(--accent-principal)]" />
              MUFER RH
            </div>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Une RH fluide, humaine, precise.</h2>
            <p className="mt-4 text-base text-white/70 leading-relaxed">
              Conges, documents et indicateurs reunis dans une interface pensee pour les equipes terrain comme
              les sieges sociaux.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="mb-10 text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 lg:hidden">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)] text-lg font-black text-[var(--texte-sur-accent)]">
                  M
                </div>
                <span className="text-lg font-bold tracking-tight">MUFER</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Connexion a votre espace</h1>
              <p className="mt-3 text-sm text-[var(--texte-secondaire)] leading-relaxed">
                Accedez a la gestion RH de votre organisation
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => connexionDemo("rh")}
                disabled={charge}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col items-center gap-2 rounded-xl border-2 border-[var(--accent-principal)]/30 bg-gradient-to-b from-[var(--accent-principal)]/10 to-[var(--accent-principal)]/5 p-4 text-center transition-all hover:border-[var(--accent-principal)]/60 hover:shadow-lg hover:shadow-[var(--accent-principal)]/10 disabled:opacity-50"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--accent-principal)]/20 transition-colors group-hover:bg-[var(--accent-principal)]/30">
                  <Shield className="size-6 text-[var(--accent-principal)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--texte-principal)]">Demo RH</p>
                  <p className="text-[11px] text-[var(--texte-secondaire)]">Acces complet</p>
                </div>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => connexionDemo("employe")}
                disabled={charge}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col items-center gap-2 rounded-xl border-2 border-[var(--bordure)] bg-gradient-to-b from-[var(--surface-elevee)] to-[var(--surface-mute)]/50 p-4 text-center transition-all hover:border-[var(--texte-secondaire)]/40 hover:shadow-lg disabled:opacity-50"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--surface-mute)] transition-colors group-hover:bg-[var(--surface-mute)]/80">
                  <UserCircle className="size-6 text-[var(--texte-secondaire)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--texte-principal)]">Demo Employe</p>
                  <p className="text-[11px] text-[var(--texte-secondaire)]">Acces restreint</p>
                </div>
              </motion.button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--bordure)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--surface-racine)] px-3 text-[var(--texte-secondaire)]">ou</span>
              </div>
            </div>

            <Carte className="border-[var(--bordure)]/60 bg-[var(--surface-elevee)]/80 shadow-xl backdrop-blur-sm">
              <CarteEntete className="pb-4">
                <CarteTitre className="text-lg">Connexion manuelle</CarteTitre>
                <CarteDescription>Entrez vos identifiants pour vous connecter</CarteDescription>
              </CarteEntete>
              <CarteContenu className="pt-0">
                <form className="space-y-5" onSubmit={soumettre}>
                  <div className="space-y-2">
                    <Etiquette htmlFor="email" className="text-sm font-medium">Adresse e-mail</Etiquette>
                    <Entree
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="votre@email.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="mdp" className="text-sm font-medium">Mot de passe</Etiquette>
                    <Entree
                      id="mdp"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Votre mot de passe"
                      value={motDePasse}
                      onChange={(e) => setMotDePasse(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  {erreur ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]"
                    >
                      {erreur}
                    </motion.p>
                  ) : null}
                  <Bouton type="submit" className="h-11 w-full text-sm font-semibold" disabled={charge}>
                    {charge ? "Connexion en cours..." : "Se connecter"}
                  </Bouton>
                </form>
              </CarteContenu>
            </Carte>

            <p className="mt-6 text-center text-xs text-[var(--texte-secondaire)]">
              Pour tester, utilisez les boutons demo ci-dessus ou le mot de passe{" "}
              <code className="rounded bg-[var(--surface-mute)] px-1.5 py-0.5 font-mono text-[var(--texte-principal)]">demo123</code>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
