"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  Eye,
  EyeOff,
  Check,
  X,
  Smartphone,
  Mail,
  Save,
  Camera,
} from "lucide-react";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Bouton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Etiquette } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialogue,
  ContenuDialogue,
  EnteteDialogue,
  TitreDialogue,
  DescriptionDialogue,
} from "@/components/ui/dialog";
import { magasinApplication } from "@/stores/magasin-application";
import { cn } from "@/lib/utils";

type OngletParametre = "profil" | "securite" | "notifications" | "apparence";

const onglets: { id: OngletParametre; label: string; icon: React.ReactNode }[] = [
  { id: "profil", label: "Mon Profil", icon: <User className="size-4" /> },
  { id: "securite", label: "Securite", icon: <Shield className="size-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="size-4" /> },
  { id: "apparence", label: "Apparence", icon: <Palette className="size-4" /> },
];

export function VueParametres() {
  const { theme, setTheme } = useTheme();
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const [ongletActif, setOngletActif] = useState<OngletParametre>("profil");

  // Profil state
  const [prenom, setPrenom] = useState(utilisateur?.prenom || "");
  const [nom, setNom] = useState(utilisateur?.nom || "");
  const [email, setEmail] = useState(utilisateur?.email || "");
  const [telephone, setTelephone] = useState("+33 6 12 34 56 78");
  const [adresse, setAdresse] = useState("123 Rue de Paris, 75001 Paris");
  const [profilModifie, setProfilModifie] = useState(false);

  // Security state
  const [motDePasseActuel, setMotDePasseActuel] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
  const [afficherMdpActuel, setAfficherMdpActuel] = useState(false);
  const [afficherNouveauMdp, setAfficherNouveauMdp] = useState(false);
  const [afficherConfirmerMdp, setAfficherConfirmerMdp] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [code2FA, setCode2FA] = useState("");

  // Notifications state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifConges, setNotifConges] = useState(true);
  const [notifDocuments, setNotifDocuments] = useState(true);
  const [notifAbsences, setNotifAbsences] = useState(true);
  const [notifRappels, setNotifRappels] = useState(false);

  // Success/Error states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleSaveProfil = () => {
    setProfilModifie(false);
    showSuccess("Profil mis a jour avec succes");
  };

  const handleChangePassword = () => {
    if (nouveauMotDePasse !== confirmerMotDePasse) {
      showError("Les mots de passe ne correspondent pas");
      return;
    }
    if (nouveauMotDePasse.length < 8) {
      showError("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }
    setMotDePasseActuel("");
    setNouveauMotDePasse("");
    setConfirmerMotDePasse("");
    showSuccess("Mot de passe modifie avec succes");
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      setIs2FAEnabled(false);
      showSuccess("Authentification a deux facteurs desactivee");
    } else {
      setModal2FA(true);
    }
  };

  const handleConfirm2FA = () => {
    if (code2FA.length === 6) {
      setIs2FAEnabled(true);
      setModal2FA(false);
      setCode2FA("");
      showSuccess("Authentification a deux facteurs activee");
    } else {
      showError("Code invalide");
    }
  };

  if (!utilisateur) return null;

  return (
    <div className="space-y-6">
      {/* Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-600"
          >
            <Check className="size-5" />
            <span className="text-sm font-medium">{successMessage}</span>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-600"
          >
            <X className="size-5" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--bordure)] bg-[var(--surface-elevee)] p-1.5">
        {onglets.map((onglet) => (
          <button
            key={onglet.id}
            type="button"
            onClick={() => setOngletActif(onglet.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              ongletActif === onglet.id
                ? "bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] shadow-md"
                : "text-[var(--texte-secondaire)] hover:bg-[var(--surface-survol)] hover:text-[var(--texte-principal)]"
            )}
          >
            {onglet.icon}
            <span className="hidden sm:inline">{onglet.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ongletActif}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* PROFIL */}
          {ongletActif === "profil" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Photo de profil */}
              <Carte className="lg:col-span-1">
                <CarteEntete>
                  <CarteTitre>Photo de profil</CarteTitre>
                  <CarteDescription>Votre photo visible par les autres</CarteDescription>
                </CarteEntete>
                <CarteContenu className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="size-32 ring-4 ring-[var(--accent-principal)]/20">
                      {utilisateur.photoUrl ? (
                        <AvatarImage src={utilisateur.photoUrl} alt="" />
                      ) : null}
                      <AvatarFallback className="bg-[var(--accent-principal)]/10 text-3xl font-bold text-[var(--accent-principal)]">
                        {utilisateur.prenom[0]}
                        {utilisateur.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border-4 border-[var(--surface-elevee)] bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] transition-transform hover:scale-110"
                    >
                      <Camera className="size-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[var(--texte-principal)]">
                      {utilisateur.prenom} {utilisateur.nom}
                    </p>
                    <p className="text-sm text-[var(--texte-secondaire)]">{utilisateur.poste}</p>
                    <p className="mt-1 text-xs text-[var(--texte-tertiaire)]">{utilisateur.departement}</p>
                  </div>
                  <Bouton variante="secondaire" className="w-full">
                    <Camera className="size-4" />
                    Changer la photo
                  </Bouton>
                </CarteContenu>
              </Carte>

              {/* Informations personnelles */}
              <Carte className="lg:col-span-2">
                <CarteEntete>
                  <CarteTitre>Informations personnelles</CarteTitre>
                  <CarteDescription>Modifiez vos informations de contact</CarteDescription>
                </CarteEntete>
                <CarteContenu className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette htmlFor="prenom">Prenom</Etiquette>
                      <Input
                        id="prenom"
                        value={prenom}
                        onChange={(e) => {
                          setPrenom(e.target.value);
                          setProfilModifie(true);
                        }}
                        placeholder="Votre prenom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette htmlFor="nom">Nom</Etiquette>
                      <Input
                        id="nom"
                        value={nom}
                        onChange={(e) => {
                          setNom(e.target.value);
                          setProfilModifie(true);
                        }}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="email">Email</Etiquette>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-tertiaire)]" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setProfilModifie(true);
                        }}
                        className="pl-10"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="telephone">Telephone</Etiquette>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-tertiaire)]" />
                      <Input
                        id="telephone"
                        type="tel"
                        value={telephone}
                        onChange={(e) => {
                          setTelephone(e.target.value);
                          setProfilModifie(true);
                        }}
                        className="pl-10"
                        placeholder="+33 6 00 00 00 00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="adresse">Adresse</Etiquette>
                    <Input
                      id="adresse"
                      value={adresse}
                      onChange={(e) => {
                        setAdresse(e.target.value);
                        setProfilModifie(true);
                      }}
                      placeholder="Votre adresse"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Bouton onClick={handleSaveProfil} disabled={!profilModifie}>
                      <Save className="size-4" />
                      Enregistrer les modifications
                    </Bouton>
                  </div>
                </CarteContenu>
              </Carte>
            </div>
          )}

          {/* SECURITE */}
          {ongletActif === "securite" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Mot de passe */}
              <Carte>
                <CarteEntete>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                      <Lock className="size-5 text-[var(--accent-principal)]" />
                    </div>
                    <div>
                      <CarteTitre>Mot de passe</CarteTitre>
                      <CarteDescription>Modifiez votre mot de passe</CarteDescription>
                    </div>
                  </div>
                </CarteEntete>
                <CarteContenu className="space-y-4">
                  <div className="space-y-2">
                    <Etiquette htmlFor="mdp-actuel">Mot de passe actuel</Etiquette>
                    <div className="relative">
                      <Input
                        id="mdp-actuel"
                        type={afficherMdpActuel ? "text" : "password"}
                        value={motDePasseActuel}
                        onChange={(e) => setMotDePasseActuel(e.target.value)}
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => setAfficherMdpActuel(!afficherMdpActuel)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--texte-tertiaire)] hover:text-[var(--texte-principal)]"
                      >
                        {afficherMdpActuel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="nouveau-mdp">Nouveau mot de passe</Etiquette>
                    <div className="relative">
                      <Input
                        id="nouveau-mdp"
                        type={afficherNouveauMdp ? "text" : "password"}
                        value={nouveauMotDePasse}
                        onChange={(e) => setNouveauMotDePasse(e.target.value)}
                        placeholder="Minimum 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setAfficherNouveauMdp(!afficherNouveauMdp)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--texte-tertiaire)] hover:text-[var(--texte-principal)]"
                      >
                        {afficherNouveauMdp ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="confirmer-mdp">Confirmer le mot de passe</Etiquette>
                    <div className="relative">
                      <Input
                        id="confirmer-mdp"
                        type={afficherConfirmerMdp ? "text" : "password"}
                        value={confirmerMotDePasse}
                        onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                        placeholder="Confirmez le nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setAfficherConfirmerMdp(!afficherConfirmerMdp)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--texte-tertiaire)] hover:text-[var(--texte-principal)]"
                      >
                        {afficherConfirmerMdp ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <Bouton
                    onClick={handleChangePassword}
                    disabled={!motDePasseActuel || !nouveauMotDePasse || !confirmerMotDePasse}
                    className="w-full"
                  >
                    Modifier le mot de passe
                  </Bouton>
                </CarteContenu>
              </Carte>

              {/* 2FA */}
              <Carte>
                <CarteEntete>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                      <Shield className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <CarteTitre>Authentification a deux facteurs</CarteTitre>
                      <CarteDescription>Securisez votre compte avec le 2FA</CarteDescription>
                    </div>
                  </div>
                </CarteEntete>
                <CarteContenu className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] bg-[var(--surface-survol)] p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="size-5 text-[var(--texte-secondaire)]" />
                      <div>
                        <p className="font-medium text-[var(--texte-principal)]">Application Authenticator</p>
                        <p className="text-sm text-[var(--texte-secondaire)]">
                          {is2FAEnabled ? "Active" : "Non configure"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggle2FA}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        is2FAEnabled ? "bg-emerald-500" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          is2FAEnabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                    <p className="text-sm text-blue-600">
                      L&apos;authentification a deux facteurs ajoute une couche de securite supplementaire
                      en demandant un code genere par une application lors de la connexion.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[var(--texte-principal)]">Sessions actives</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-[var(--bordure)] p-3">
                        <div className="flex items-center gap-3">
                          <div className="size-2 rounded-full bg-emerald-500" />
                          <div>
                            <p className="text-sm font-medium">Chrome - Windows</p>
                            <p className="text-xs text-[var(--texte-tertiaire)]">Paris, France - Maintenant</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600">Session actuelle</span>
                      </div>
                    </div>
                  </div>
                </CarteContenu>
              </Carte>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {ongletActif === "notifications" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Canaux de notification */}
              <Carte>
                <CarteEntete>
                  <CarteTitre>Canaux de notification</CarteTitre>
                  <CarteDescription>Comment souhaitez-vous etre notifie</CarteDescription>
                </CarteEntete>
                <CarteContenu className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="size-5 text-[var(--texte-secondaire)]" />
                      <div>
                        <p className="font-medium text-[var(--texte-principal)]">Email</p>
                        <p className="text-sm text-[var(--texte-secondaire)]">Recevoir par email</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifEmail(!notifEmail)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifEmail ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifEmail ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="size-5 text-[var(--texte-secondaire)]" />
                      <div>
                        <p className="font-medium text-[var(--texte-principal)]">Notifications push</p>
                        <p className="text-sm text-[var(--texte-secondaire)]">Notifications navigateur</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifPush(!notifPush)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifPush ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifPush ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="size-5 text-[var(--texte-secondaire)]" />
                      <div>
                        <p className="font-medium text-[var(--texte-principal)]">SMS</p>
                        <p className="text-sm text-[var(--texte-secondaire)]">Recevoir par SMS</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifSMS(!notifSMS)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifSMS ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifSMS ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </CarteContenu>
              </Carte>

              {/* Types de notification */}
              <Carte>
                <CarteEntete>
                  <CarteTitre>Types de notification</CarteTitre>
                  <CarteDescription>Selectionnez ce que vous souhaitez recevoir</CarteDescription>
                </CarteEntete>
                <CarteContenu className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div>
                      <p className="font-medium text-[var(--texte-principal)]">Conges et absences</p>
                      <p className="text-sm text-[var(--texte-secondaire)]">Validation, refus, rappels</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifConges(!notifConges)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifConges ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifConges ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div>
                      <p className="font-medium text-[var(--texte-principal)]">Documents</p>
                      <p className="text-sm text-[var(--texte-secondaire)]">Demandes, mises a jour</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifDocuments(!notifDocuments)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifDocuments ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifDocuments ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div>
                      <p className="font-medium text-[var(--texte-principal)]">Absences equipe</p>
                      <p className="text-sm text-[var(--texte-secondaire)]">Absences des collegues</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifAbsences(!notifAbsences)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifAbsences ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifAbsences ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[var(--bordure)] p-4">
                    <div>
                      <p className="font-medium text-[var(--texte-principal)]">Rappels</p>
                      <p className="text-sm text-[var(--texte-secondaire)]">Rappels et echeances</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifRappels(!notifRappels)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        notifRappels ? "bg-[var(--accent-principal)]" : "bg-[var(--bordure)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white shadow-md transition-transform",
                          notifRappels ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </CarteContenu>
              </Carte>
            </div>
          )}

          {/* APPARENCE */}
          {ongletActif === "apparence" && (
            <Carte>
              <CarteEntete>
                <CarteTitre>Theme de l&apos;application</CarteTitre>
                <CarteDescription>Choisissez votre preference d&apos;affichage</CarteDescription>
              </CarteEntete>
              <CarteContenu>
                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                      theme === "light"
                        ? "border-[var(--accent-principal)] bg-[var(--accent-principal)]/5"
                        : "border-[var(--bordure)] hover:border-[var(--accent-principal)]/50"
                    )}
                  >
                    {theme === "light" && (
                      <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[var(--accent-principal)]">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                    <div className="size-16 rounded-xl bg-gradient-to-br from-white to-gray-100 shadow-md ring-1 ring-gray-200" />
                    <span className="font-medium">Clair</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                      theme === "dark"
                        ? "border-[var(--accent-principal)] bg-[var(--accent-principal)]/5"
                        : "border-[var(--bordure)] hover:border-[var(--accent-principal)]/50"
                    )}
                  >
                    {theme === "dark" && (
                      <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[var(--accent-principal)]">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                    <div className="size-16 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-md ring-1 ring-gray-700" />
                    <span className="font-medium">Sombre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                      theme === "system"
                        ? "border-[var(--accent-principal)] bg-[var(--accent-principal)]/5"
                        : "border-[var(--bordure)] hover:border-[var(--accent-principal)]/50"
                    )}
                  >
                    {theme === "system" && (
                      <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[var(--accent-principal)]">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                    <div className="size-16 overflow-hidden rounded-xl shadow-md ring-1 ring-gray-300">
                      <div className="h-1/2 bg-gradient-to-br from-white to-gray-100" />
                      <div className="h-1/2 bg-gradient-to-br from-gray-800 to-gray-900" />
                    </div>
                    <span className="font-medium">Systeme</span>
                  </button>
                </div>
              </CarteContenu>
            </Carte>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal 2FA */}
      <Dialogue open={modal2FA} onOpenChange={setModal2FA}>
        <ContenuDialogue>
          <EnteteDialogue>
            <TitreDialogue>Configurer l&apos;authentification 2FA</TitreDialogue>
            <DescriptionDialogue>
              Scannez le QR code avec votre application Authenticator
            </DescriptionDialogue>
          </EnteteDialogue>
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="flex size-48 items-center justify-center rounded-xl border-2 border-dashed border-[var(--bordure)] bg-[var(--surface-survol)]">
                <div className="text-center">
                  <Shield className="mx-auto size-12 text-[var(--texte-tertiaire)]" />
                  <p className="mt-2 text-sm text-[var(--texte-tertiaire)]">QR Code</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Etiquette htmlFor="code-2fa">Code de verification</Etiquette>
              <Input
                id="code-2fa"
                value={code2FA}
                onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em]"
                maxLength={6}
              />
              <p className="text-center text-sm text-[var(--texte-secondaire)]">
                Entrez le code a 6 chiffres de votre application
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Bouton variante="secondaire" onClick={() => setModal2FA(false)}>
              Annuler
            </Bouton>
            <Bouton onClick={handleConfirm2FA} disabled={code2FA.length !== 6}>
              Activer le 2FA
            </Bouton>
          </div>
        </ContenuDialogue>
      </Dialogue>
    </div>
  );
}
