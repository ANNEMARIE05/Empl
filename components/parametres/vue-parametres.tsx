"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Shield,
  Smartphone,
  User,
  Save,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Bouton } from "@/components/ui/button";
import { Entree } from "@/components/ui/input";
import { Etiquette } from "@/components/ui/label";
import {
  Dialogue,
  ContenuDialogue,
  EnteteDialogue,
  TitreDialogue,
} from "@/components/ui/dialog";
import { magasinApplication } from "@/stores/magasin-application";
import { cn } from "@/lib/utils";

type OngletParametres = "profil" | "securite";

export function VueParametres() {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  
  const [ongletActif, setOngletActif] = useState<OngletParametres>("profil");
  
  // States pour le profil
  const [prenom, setPrenom] = useState(utilisateur?.prenom ?? "");
  const [nom, setNom] = useState(utilisateur?.nom ?? "");
  const [email, setEmail] = useState(utilisateur?.email ?? "");
  const [telephone, setTelephone] = useState("");
  const [profilSauvegarde, setProfilSauvegarde] = useState(false);
  
  // States pour le mot de passe
  const [motDePasseActuel, setMotDePasseActuel] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [motDePasseSauvegarde, setMotDePasseSauvegarde] = useState(false);
  
  // States pour 2FA
  const [deuxFaActif, setDeuxFaActif] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [code2FA, setCode2FA] = useState("");
  const [etape2FA, setEtape2FA] = useState<"qr" | "verification">("qr");

  const onglets: { id: OngletParametres; libelle: string; icone: React.ReactNode }[] = [
    { id: "profil", libelle: "Mon profil", icone: <User className="size-4" /> },
    { id: "securite", libelle: "Securite", icone: <Shield className="size-4" /> },
  ];

  const sauvegarderProfil = () => {
    setProfilSauvegarde(true);
    setTimeout(() => setProfilSauvegarde(false), 2000);
  };

  const sauvegarderMotDePasse = () => {
    if (nouveauMotDePasse !== confirmerMotDePasse) return;
    setMotDePasseSauvegarde(true);
    setMotDePasseActuel("");
    setNouveauMotDePasse("");
    setConfirmerMotDePasse("");
    setTimeout(() => setMotDePasseSauvegarde(false), 2000);
  };

  const activer2FA = () => {
    if (code2FA.length === 6) {
      setDeuxFaActif(true);
      setModal2FA(false);
      setCode2FA("");
      setEtape2FA("qr");
    }
  };

  const desactiver2FA = () => {
    setDeuxFaActif(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
          <Settings className="size-6 text-[var(--accent-principal)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Parametres</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">
            Gerez vos informations et votre securite
          </p>
        </div>
      </div>

      {/* Navigation par onglets */}
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
                : "text-[var(--texte-secondaire)] hover:bg-[var(--surface-mute)] hover:text-[var(--texte-principal)]"
            )}
          >
            {onglet.icone}
            <span>{onglet.libelle}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={ongletActif}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Onglet Profil */}
          {ongletActif === "profil" && (
            <div className="space-y-4 sm:space-y-6">
              <Carte>
                <CarteEntete>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                      <User className="size-5 text-[var(--accent-principal)]" />
                    </div>
                    <div>
                      <CarteTitre>Informations personnelles</CarteTitre>
                      <CarteDescription>Modifiez vos informations de profil</CarteDescription>
                    </div>
                  </div>
                </CarteEntete>
                <CarteContenu className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette htmlFor="prenom">Prenom</Etiquette>
                      <Entree
                        id="prenom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        placeholder="Votre prenom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette htmlFor="nom">Nom</Etiquette>
                      <Entree
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="email">Adresse email</Etiquette>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)]" />
                      <Entree
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Etiquette htmlFor="telephone">Telephone</Etiquette>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)]" />
                      <Entree
                        id="telephone"
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="+33 6 00 00 00 00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Bouton onClick={sauvegarderProfil} disabled={profilSauvegarde}>
                      {profilSauvegarde ? (
                        <>
                          <Check className="size-4" />
                          Sauvegarde
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          Enregistrer
                        </>
                      )}
                    </Bouton>
                  </div>
                </CarteContenu>
              </Carte>
            </div>
          )}

          {/* Onglet Securite */}
          {ongletActif === "securite" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Mot de passe */}
              <Carte>
                <CarteEntete>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15">
                      <Key className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <CarteTitre>Modifier le mot de passe</CarteTitre>
                      <CarteDescription>Mettez a jour votre mot de passe</CarteDescription>
                    </div>
                  </div>
                </CarteEntete>
                <CarteContenu className="space-y-4">
                  <div className="space-y-2">
                    <Etiquette htmlFor="motDePasseActuel">Mot de passe actuel</Etiquette>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)]" />
                      <Entree
                        id="motDePasseActuel"
                        type={afficherMotDePasse ? "text" : "password"}
                        value={motDePasseActuel}
                        onChange={(e) => setMotDePasseActuel(e.target.value)}
                        placeholder="Mot de passe actuel"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--texte-secondaire)] hover:text-[var(--texte-principal)]"
                      >
                        {afficherMotDePasse ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette htmlFor="nouveauMotDePasse">Nouveau mot de passe</Etiquette>
                      <Entree
                        id="nouveauMotDePasse"
                        type={afficherMotDePasse ? "text" : "password"}
                        value={nouveauMotDePasse}
                        onChange={(e) => setNouveauMotDePasse(e.target.value)}
                        placeholder="Nouveau mot de passe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette htmlFor="confirmerMotDePasse">Confirmer</Etiquette>
                      <Entree
                        id="confirmerMotDePasse"
                        type={afficherMotDePasse ? "text" : "password"}
                        value={confirmerMotDePasse}
                        onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                      />
                    </div>
                  </div>
                  {nouveauMotDePasse && confirmerMotDePasse && nouveauMotDePasse !== confirmerMotDePasse && (
                    <p className="flex items-center gap-2 text-sm text-[var(--danger)]">
                      <AlertTriangle className="size-4" />
                      Les mots de passe ne correspondent pas
                    </p>
                  )}
                  <div className="flex justify-end pt-2">
                    <Bouton
                      onClick={sauvegarderMotDePasse}
                      disabled={!motDePasseActuel || !nouveauMotDePasse || nouveauMotDePasse !== confirmerMotDePasse || motDePasseSauvegarde}
                    >
                      {motDePasseSauvegarde ? (
                        <>
                          <Check className="size-4" />
                          Mot de passe modifie
                        </>
                      ) : (
                        <>
                          <Key className="size-4" />
                          Modifier
                        </>
                      )}
                    </Bouton>
                  </div>
                </CarteContenu>
              </Carte>

              {/* 2FA */}
              <Carte>
                <CarteEntete>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        deuxFaActif ? "bg-emerald-500/15" : "bg-[var(--surface-mute)]"
                      )}>
                        <Shield className={cn("size-5", deuxFaActif ? "text-emerald-600" : "text-[var(--texte-secondaire)]")} />
                      </div>
                      <div>
                        <CarteTitre>Authentification a deux facteurs (2FA)</CarteTitre>
                        <CarteDescription>
                          {deuxFaActif ? "Active - Votre compte est securise" : "Ajoutez une couche de securite supplementaire"}
                        </CarteDescription>
                      </div>
                    </div>
                    {deuxFaActif && (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Active
                      </span>
                    )}
                  </div>
                </CarteEntete>
                <CarteContenu>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[var(--texte-secondaire)]">
                      {deuxFaActif
                        ? "Votre compte est protege par l'authentification a deux facteurs via une application d'authentification."
                        : "Utilisez une application comme Google Authenticator ou Authy pour generer des codes de verification."}
                    </p>
                    {deuxFaActif ? (
                      <Bouton variante="destructif" onClick={desactiver2FA}>
                        Desactiver
                      </Bouton>
                    ) : (
                      <Bouton onClick={() => setModal2FA(true)}>
                        <Shield className="size-4" />
                        Activer 2FA
                      </Bouton>
                    )}
                  </div>
                </CarteContenu>
              </Carte>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal 2FA */}
      <Dialogue open={modal2FA} onOpenChange={setModal2FA}>
        <ContenuDialogue className="max-w-md">
          <EnteteDialogue>
            <TitreDialogue className="flex items-center gap-2">
              <Shield className="size-5 text-[var(--accent-principal)]" />
              Activer l&apos;authentification 2FA
            </TitreDialogue>
          </EnteteDialogue>
          
          <div className="space-y-4">
            {etape2FA === "qr" && (
              <>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  Scannez ce QR code avec votre application d&apos;authentification (Google Authenticator, Authy, etc.)
                </p>
                <div className="flex justify-center">
                  <div className="flex size-48 items-center justify-center rounded-xl border-2 border-dashed border-[var(--bordure)] bg-[var(--surface-mute)]">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "size-6 rounded-sm",
                            Math.random() > 0.5 ? "bg-[var(--texte-principal)]" : "bg-transparent"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--surface-mute)] p-3">
                  <p className="text-center text-xs text-[var(--texte-secondaire)]">Cle secrete manuelle:</p>
                  <p className="mt-1 text-center font-mono text-sm font-semibold tracking-wider">ABCD-EFGH-IJKL-MNOP</p>
                </div>
                <Bouton className="w-full" onClick={() => setEtape2FA("verification")}>
                  J&apos;ai scanne le QR code
                </Bouton>
              </>
            )}

            {etape2FA === "verification" && (
              <>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  Entrez le code a 6 chiffres genere par votre application d&apos;authentification.
                </p>
                <div className="space-y-2">
                  <Etiquette htmlFor="code2fa">Code de verification</Etiquette>
                  <Entree
                    id="code2fa"
                    value={code2FA}
                    onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl font-mono tracking-[0.5em]"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Bouton variante="secondaire" className="flex-1" onClick={() => setEtape2FA("qr")}>
                    Retour
                  </Bouton>
                  <Bouton className="flex-1" onClick={activer2FA} disabled={code2FA.length !== 6}>
                    Activer
                  </Bouton>
                </div>
              </>
            )}
          </div>
        </ContenuDialogue>
      </Dialogue>
    </div>
  );
}
