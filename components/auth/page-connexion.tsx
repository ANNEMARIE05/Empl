"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Users } from "lucide-react";
import { Bouton } from "@/components/ui/button";
import { Chargeur } from "@/components/ui/loader";
import { Entree } from "@/components/ui/input";
import { AppBackgroundDecor } from "@/components/layout/app-background-decor";
import { useRouter } from "next/navigation";
import { magasinApplication } from "@/stores/magasin-application";

export function PageConnexion() {
  const router = useRouter();
  const connecter = magasinApplication((s) => s.connecter);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");

    if (!email || !motDePasse) {
      setErreur("Veuillez remplir tous les champs");
      return;
    }

    setChargement(true);
    try {
      await connecter(email, motDePasse);
      router.replace("/?page=tableau-bord");
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch {
      setErreur("Email ou mot de passe incorrect");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-row items-stretch overflow-x-clip lg:h-dvh lg:max-h-dvh lg:overflow-y-hidden">
      <AppBackgroundDecor />
      <motion.div
        className="flex w-full flex-col items-center justify-start self-stretch overflow-y-auto bg-[var(--surface-racine)] p-8 pb-10 pt-12 lg:w-1/2 lg:max-h-dvh lg:overflow-y-auto lg:p-16 lg:pb-12 lg:pt-16"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-md space-y-8">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--bordure)]/60 bg-[var(--texte-principal)]">
                <Users className="size-6 text-[var(--surface-elevee)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--texte-principal)]">MUFER</h1>
                <p className="text-xs font-semibold tracking-widest text-[var(--accent-principal)]">EMPLOYES</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-semibold text-[var(--texte-principal)]">Bienvenue</h2>
            <p className="mt-2 text-[var(--texte-secondaire)]">Connectez-vous pour accéder à votre espace RH</p>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--texte-principal)]">Adresse email</label>
              <Entree
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.fr"
                autoComplete="username"
                className="h-12 rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] px-4 py-3 text-base shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--texte-principal)]">Mot de passe</label>
              <div className="relative">
                <Entree
                  type={afficherMotDePasse ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  autoComplete="current-password"
                  className="h-12 rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] px-4 py-3 pr-12 text-base shadow-none"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--texte-secondaire)] transition-colors hover:text-[var(--texte-principal)]"
                >
                  {afficherMotDePasse ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {erreur ? (
                <motion.p
                  className="rounded-xl border border-[color-mix(in_oklch,var(--danger)_35%,transparent)] bg-[color-mix(in_oklch,var(--danger)_10%,transparent)] px-4 py-2 text-sm text-[var(--danger)]"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {erreur}
                </motion.p>
              ) : null}
            </AnimatePresence>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <label className="group flex min-w-0 cursor-pointer items-center gap-3">
                <div className="relative shrink-0">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="size-5 rounded-lg border border-[var(--bordure)]/60 transition-all peer-checked:border-[var(--texte-principal)] peer-checked:bg-[var(--texte-principal)]" />
                  <svg
                    className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-[var(--surface-elevee)] opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--texte-secondaire)] transition-colors group-hover:text-[var(--texte-principal)]">
                  Rester connecté
                </span>
              </label>
              <button
                type="button"
                className="shrink-0 text-xs text-[var(--accent-principal)] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <Bouton
              type="submit"
              disabled={chargement}
              variante="secondaire"
              className="h-12 w-full gap-2 rounded-xl border-0 bg-[var(--texte-principal)] font-medium text-[var(--surface-elevee)] shadow-none hover:border-transparent hover:bg-[color-mix(in_oklch,var(--texte-principal)_88%,white)] hover:text-[var(--surface-elevee)] active:scale-[0.98]"
            >
              {chargement ? (
                <Chargeur
                  taille="sm"
                  variante="spinner"
                  className="[&>div:first-child]:border-[color-mix(in_oklch,var(--surface-elevee)_35%,transparent)] [&>div:first-child]:border-t-[var(--surface-elevee)]"
                />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="size-4" />
                </>
              )}
            </Bouton>
          </motion.form>
          <motion.div
            className="border-t border-[var(--bordure)]/50 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="mb-4 text-center text-sm text-[var(--texte-secondaire)]">Accès démo rapide</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail("rh@entreprise.fr");
                  setMotDePasse("demo123");
                }}
                className="rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] px-4 py-2.5 text-sm text-[var(--texte-principal)] transition-colors hover:border-[var(--bordure)] hover:bg-[var(--surface-mute)]"
              >
                Admin RH
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("employe@entreprise.fr");
                  setMotDePasse("demo123");
                }}
                className="rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] px-4 py-2.5 text-sm text-[var(--texte-principal)] transition-colors hover:border-[var(--bordure)] hover:bg-[var(--surface-mute)]"
              >
                Employé
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="relative hidden min-h-0 flex-1 self-stretch overflow-hidden bg-[var(--texte-principal)] lg:flex lg:w-1/2 lg:flex-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=1600&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--texte-principal)_60%,transparent)]" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-[var(--surface-elevee)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <blockquote className="space-y-4">
              <p className="max-w-md text-2xl font-light leading-relaxed">
                &ldquo;Simplifiez la gestion de vos ressources humaines avec une solution moderne et
                intuitive.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="h-0.5 w-12 bg-[var(--accent-principal)]" />
                <div>
                  <p className="font-medium">MUFER Employés</p>
                  <p className="text-sm text-[color-mix(in_oklch,var(--surface-elevee)_70%,transparent)]">
                    Votre partenaire RH
                  </p>
                </div>
              </footer>
            </blockquote>
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-[var(--bordure)]/40 pt-8">
              <div>
                <p className="text-3xl font-bold text-[var(--accent-principal)]">500+</p>
                <p className="mt-1 text-sm text-[color-mix(in_oklch,var(--surface-elevee)_70%,transparent)]">
                  Entreprises
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--accent-principal)]">15K+</p>
                <p className="mt-1 text-sm text-[color-mix(in_oklch,var(--surface-elevee)_70%,transparent)]">
                  Employés gérés
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--accent-principal)]">98%</p>
                <p className="mt-1 text-sm text-[color-mix(in_oklch,var(--surface-elevee)_70%,transparent)]">
                  Satisfaction
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute right-20 top-20 size-32 rounded-xl border border-[var(--bordure)]/40"
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        <motion.div
          className="absolute right-32 top-32 size-20 bg-[color-mix(in_oklch,var(--accent-principal)_20%,transparent)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
}
