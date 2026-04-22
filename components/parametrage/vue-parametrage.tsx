"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  FileText,
  Users,
  Building2,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronRight,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { EntetePage } from "@/components/ui/entete-page";
import { Etiquette } from "@/components/ui/label";
import { Pastille } from "@/components/ui/badge";

// Types pour les parametres
interface TypeDocument {
  id: string;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
}

interface Role {
  id: string;
  code: string;
  libelle: string;
  description: string;
  permissions: string[];
  actif: boolean;
}

interface Departement {
  id: string;
  code: string;
  nom: string;
  responsableId?: string;
  actif: boolean;
}

interface TypeCongeParam {
  id: string;
  code: string;
  libelle: string;
  joursMax: number;
  necessiteJustificatif: boolean;
  actif: boolean;
}

interface RegleValidation {
  id: string;
  nom: string;
  description: string;
  delaiValidationJours: number;
  notificationAuto: boolean;
  actif: boolean;
}

type OngletParametrage = "types-documents" | "roles" | "departements" | "types-conges" | "regles-validation";

// Donnees initiales
const typesDocumentsInitiaux: TypeDocument[] = [
  { id: "1", code: "attestation_salaire", libelle: "Attestation de salaire", description: "Document attestant du salaire mensuel", actif: true },
  { id: "2", code: "certificat_travail", libelle: "Certificat de travail", description: "Certificat attestant de l'emploi", actif: true },
  { id: "3", code: "rib", libelle: "RIB", description: "Releve d'identite bancaire", actif: true },
  { id: "4", code: "convention_stage", libelle: "Convention de stage", description: "Convention pour les stagiaires", actif: true },
  { id: "5", code: "autre", libelle: "Autre", description: "Autres types de documents", actif: true },
];

const rolesInitiaux: Role[] = [
  { id: "1", code: "rh", libelle: "Ressources Humaines", description: "Acces complet a la gestion RH", permissions: ["gestion_employes", "gestion_conges", "gestion_documents", "parametrage"], actif: true },
  { id: "2", code: "manager", libelle: "Manager", description: "Gestion de son equipe", permissions: ["voir_equipe", "valider_conges", "voir_documents"], actif: true },
  { id: "3", code: "employe", libelle: "Employe", description: "Acces basique employe", permissions: ["voir_profil", "demander_conges", "demander_documents"], actif: true },
];

const departementsInitiaux: Departement[] = [
  { id: "1", code: "RH", nom: "Ressources Humaines", actif: true },
  { id: "2", code: "IT", nom: "Informatique", actif: true },
  { id: "3", code: "FIN", nom: "Finance", actif: true },
  { id: "4", code: "COM", nom: "Commercial", actif: true },
  { id: "5", code: "MKT", nom: "Marketing", actif: true },
];

const typesCongesInitiaux: TypeCongeParam[] = [
  { id: "1", code: "annuel", libelle: "Conge annuel", joursMax: 25, necessiteJustificatif: false, actif: true },
  { id: "2", code: "sans_solde", libelle: "Conge sans solde", joursMax: 30, necessiteJustificatif: false, actif: true },
  { id: "3", code: "maladie", libelle: "Arret maladie", joursMax: 365, necessiteJustificatif: true, actif: true },
  { id: "4", code: "maternite", libelle: "Conge maternite", joursMax: 112, necessiteJustificatif: true, actif: true },
  { id: "5", code: "autre", libelle: "Autre", joursMax: 10, necessiteJustificatif: false, actif: true },
];

const reglesValidationInitiales: RegleValidation[] = [
  { id: "1", nom: "Validation conges standard", description: "Delai standard pour la validation des conges", delaiValidationJours: 5, notificationAuto: true, actif: true },
  { id: "2", nom: "Validation documents urgents", description: "Traitement prioritaire des documents", delaiValidationJours: 2, notificationAuto: true, actif: true },
  { id: "3", nom: "Rappel automatique", description: "Rappel si demande non traitee", delaiValidationJours: 3, notificationAuto: true, actif: true },
];

const onglets: { id: OngletParametrage; libelle: string; icone: React.ReactNode; description: string }[] = [
  { id: "types-documents", libelle: "Types de documents", icone: <FileText className="size-5" />, description: "Gerer les types de documents disponibles" },
  { id: "roles", libelle: "Roles", icone: <Shield className="size-5" />, description: "Gerer les roles et permissions" },
  { id: "departements", libelle: "Departements", icone: <Building2 className="size-5" />, description: "Gerer les departements de l'entreprise" },
  { id: "types-conges", libelle: "Types de conges", icone: <Calendar className="size-5" />, description: "Gerer les types de conges" },
  { id: "regles-validation", libelle: "Regles de validation", icone: <Clock className="size-5" />, description: "Configurer les regles de validation" },
];

export function VueParametrage() {
  const [ongletActif, setOngletActif] = useState<OngletParametrage>("types-documents");
  const [typesDocuments, setTypesDocuments] = useState(typesDocumentsInitiaux);
  const [roles, setRoles] = useState(rolesInitiaux);
  const [departements, setDepartements] = useState(departementsInitiaux);
  const [typesConges, setTypesConges] = useState(typesCongesInitiaux);
  const [reglesValidation, setReglesValidation] = useState(reglesValidationInitiales);

  // Etats pour l'edition
  const [modeEdition, setModeEdition] = useState<string | null>(null);
  const [modeAjout, setModeAjout] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[]>>({});

  const resetForm = () => {
    setModeEdition(null);
    setModeAjout(false);
    setFormData({});
  };

  const genererNouvelId = () => Date.now().toString();

  // Fonctions CRUD pour Types de Documents
  const ajouterTypeDocument = () => {
    const nouveau: TypeDocument = {
      id: genererNouvelId(),
      code: formData.code as string || "",
      libelle: formData.libelle as string || "",
      description: formData.description as string || "",
      actif: true,
    };
    setTypesDocuments([...typesDocuments, nouveau]);
    resetForm();
  };

  const modifierTypeDocument = (id: string) => {
    setTypesDocuments(typesDocuments.map(t => 
      t.id === id ? { ...t, ...formData } as TypeDocument : t
    ));
    resetForm();
  };

  const supprimerTypeDocument = (id: string) => {
    setTypesDocuments(typesDocuments.filter(t => t.id !== id));
  };

  const toggleActifTypeDocument = (id: string) => {
    setTypesDocuments(typesDocuments.map(t => 
      t.id === id ? { ...t, actif: !t.actif } : t
    ));
  };

  // Fonctions CRUD pour Roles
  const ajouterRole = () => {
    const nouveau: Role = {
      id: genererNouvelId(),
      code: formData.code as string || "",
      libelle: formData.libelle as string || "",
      description: formData.description as string || "",
      permissions: (formData.permissions as string || "").split(",").map(p => p.trim()).filter(Boolean),
      actif: true,
    };
    setRoles([...roles, nouveau]);
    resetForm();
  };

  const modifierRole = (id: string) => {
    const permissions = typeof formData.permissions === "string" 
      ? formData.permissions.split(",").map(p => p.trim()).filter(Boolean)
      : formData.permissions as string[] || [];
    setRoles(roles.map(r => 
      r.id === id ? { ...r, ...formData, permissions } as Role : r
    ));
    resetForm();
  };

  const supprimerRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const toggleActifRole = (id: string) => {
    setRoles(roles.map(r => 
      r.id === id ? { ...r, actif: !r.actif } : r
    ));
  };

  // Fonctions CRUD pour Departements
  const ajouterDepartement = () => {
    const nouveau: Departement = {
      id: genererNouvelId(),
      code: formData.code as string || "",
      nom: formData.nom as string || "",
      actif: true,
    };
    setDepartements([...departements, nouveau]);
    resetForm();
  };

  const modifierDepartement = (id: string) => {
    setDepartements(departements.map(d => 
      d.id === id ? { ...d, ...formData } as Departement : d
    ));
    resetForm();
  };

  const supprimerDepartement = (id: string) => {
    setDepartements(departements.filter(d => d.id !== id));
  };

  const toggleActifDepartement = (id: string) => {
    setDepartements(departements.map(d => 
      d.id === id ? { ...d, actif: !d.actif } : d
    ));
  };

  // Fonctions CRUD pour Types de Conges
  const ajouterTypeConge = () => {
    const nouveau: TypeCongeParam = {
      id: genererNouvelId(),
      code: formData.code as string || "",
      libelle: formData.libelle as string || "",
      joursMax: Number(formData.joursMax) || 0,
      necessiteJustificatif: formData.necessiteJustificatif as boolean || false,
      actif: true,
    };
    setTypesConges([...typesConges, nouveau]);
    resetForm();
  };

  const modifierTypeConge = (id: string) => {
    setTypesConges(typesConges.map(t => 
      t.id === id ? { ...t, ...formData, joursMax: Number(formData.joursMax) || t.joursMax } as TypeCongeParam : t
    ));
    resetForm();
  };

  const supprimerTypeConge = (id: string) => {
    setTypesConges(typesConges.filter(t => t.id !== id));
  };

  const toggleActifTypeConge = (id: string) => {
    setTypesConges(typesConges.map(t => 
      t.id === id ? { ...t, actif: !t.actif } : t
    ));
  };

  // Fonctions CRUD pour Regles de Validation
  const ajouterRegleValidation = () => {
    const nouvelle: RegleValidation = {
      id: genererNouvelId(),
      nom: formData.nom as string || "",
      description: formData.description as string || "",
      delaiValidationJours: Number(formData.delaiValidationJours) || 0,
      notificationAuto: formData.notificationAuto as boolean || false,
      actif: true,
    };
    setReglesValidation([...reglesValidation, nouvelle]);
    resetForm();
  };

  const modifierRegleValidation = (id: string) => {
    setReglesValidation(reglesValidation.map(r => 
      r.id === id ? { ...r, ...formData, delaiValidationJours: Number(formData.delaiValidationJours) || r.delaiValidationJours } as RegleValidation : r
    ));
    resetForm();
  };

  const supprimerRegleValidation = (id: string) => {
    setReglesValidation(reglesValidation.filter(r => r.id !== id));
  };

  const toggleActifRegleValidation = (id: string) => {
    setReglesValidation(reglesValidation.map(r => 
      r.id === id ? { ...r, actif: !r.actif } : r
    ));
  };

  const commencerEdition = (id: string, data: object) => {
    setModeEdition(id);
    setFormData(data as Record<string, string | number | boolean | string[]>);
  };

  const commencerAjout = () => {
    setModeAjout(true);
    setFormData({});
  };

  const renderContenu = () => {
    switch (ongletActif) {
      case "types-documents":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Types de documents</h3>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {typesDocuments.filter(t => t.actif).length} type{typesDocuments.filter(t => t.actif).length > 1 ? "s" : ""} actif{typesDocuments.filter(t => t.actif).length > 1 ? "s" : ""}
                </p>
              </div>
              <Bouton onClick={commencerAjout} disabled={modeAjout || !!modeEdition}>
                <Plus className="size-4" />
                Ajouter
              </Bouton>
            </div>

            <AnimatePresence mode="popLayout">
              {modeAjout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-[var(--accent-principal)] bg-[var(--accent-principal)]/5 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Nouveau type de document</h4>
                    <Bouton taille="icone" variante="fantome" onClick={resetForm}>
                      <X className="size-4" />
                    </Bouton>
                  </div>
                  <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Etiquette>Code</Etiquette>
                      <input
                        type="text"
                        value={formData.code as string || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="code_document"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Libelle</Etiquette>
                      <input
                        type="text"
                        value={formData.libelle as string || ""}
                        onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Nom du document"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Description</Etiquette>
                      <input
                        type="text"
                        value={formData.description as string || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Description..."
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                    <Bouton onClick={ajouterTypeDocument}>
                      <Save className="size-4" />
                      Enregistrer
                    </Bouton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {typesDocuments.map((type) => (
                <motion.div
                  key={type.id}
                  layout
                  className={`rounded-xl border p-4 transition-colors ${
                    type.actif 
                      ? "border-[var(--bordure)] bg-[var(--surface-elevee)]" 
                      : "border-[var(--bordure)]/50 bg-[var(--surface-mute)]/50 opacity-60"
                  }`}
                >
                  {modeEdition === type.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Etiquette>Code</Etiquette>
                          <input
                            type="text"
                            value={formData.code as string || ""}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Etiquette>Libelle</Etiquette>
                          <input
                            type="text"
                            value={formData.libelle as string || ""}
                            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Etiquette>Description</Etiquette>
                          <input
                            type="text"
                            value={formData.description as string || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                        <Bouton onClick={() => modifierTypeDocument(type.id)}>
                          <Save className="size-4" />
                          Enregistrer
                        </Bouton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-principal)]/10">
                          <FileText className="size-5 text-[var(--accent-principal)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{type.libelle}</p>
                            <Pastille ton={type.actif ? "succes" : "neutre"}>
                              {type.actif ? "Actif" : "Inactif"}
                            </Pastille>
                          </div>
                          <p className="text-sm text-[var(--texte-secondaire)]">{type.description}</p>
                          <p className="text-xs text-[var(--texte-secondaire)]">Code: {type.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bouton
                          taille="sm"
                          variante="fantome"
                          onClick={() => toggleActifTypeDocument(type.id)}
                        >
                          {type.actif ? "Desactiver" : "Activer"}
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => commencerEdition(type.id, type)}
                          disabled={!!modeEdition || modeAjout}
                        >
                          <Pencil className="size-4" />
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => supprimerTypeDocument(type.id)}
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Bouton>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "roles":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Roles et permissions</h3>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {roles.filter(r => r.actif).length} role{roles.filter(r => r.actif).length > 1 ? "s" : ""} actif{roles.filter(r => r.actif).length > 1 ? "s" : ""}
                </p>
              </div>
              <Bouton onClick={commencerAjout} disabled={modeAjout || !!modeEdition}>
                <Plus className="size-4" />
                Ajouter
              </Bouton>
            </div>

            <AnimatePresence mode="popLayout">
              {modeAjout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-[var(--accent-principal)] bg-[var(--accent-principal)]/5 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Nouveau role</h4>
                    <Bouton taille="icone" variante="fantome" onClick={resetForm}>
                      <X className="size-4" />
                    </Bouton>
                  </div>
                  <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette>Code</Etiquette>
                      <input
                        type="text"
                        value={formData.code as string || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="code_role"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Libelle</Etiquette>
                      <input
                        type="text"
                        value={formData.libelle as string || ""}
                        onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Nom du role"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Etiquette>Description</Etiquette>
                      <input
                        type="text"
                        value={formData.description as string || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Description du role..."
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Etiquette>Permissions (separees par des virgules)</Etiquette>
                      <input
                        type="text"
                        value={formData.permissions as string || ""}
                        onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="gestion_employes, voir_documents, ..."
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                    <Bouton onClick={ajouterRole}>
                      <Save className="size-4" />
                      Enregistrer
                    </Bouton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  layout
                  className={`rounded-xl border p-4 transition-colors ${
                    role.actif 
                      ? "border-[var(--bordure)] bg-[var(--surface-elevee)]" 
                      : "border-[var(--bordure)]/50 bg-[var(--surface-mute)]/50 opacity-60"
                  }`}
                >
                  {modeEdition === role.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Etiquette>Code</Etiquette>
                          <input
                            type="text"
                            value={formData.code as string || ""}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Etiquette>Libelle</Etiquette>
                          <input
                            type="text"
                            value={formData.libelle as string || ""}
                            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Etiquette>Description</Etiquette>
                          <input
                            type="text"
                            value={formData.description as string || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Etiquette>Permissions</Etiquette>
                          <input
                            type="text"
                            value={Array.isArray(formData.permissions) ? formData.permissions.join(", ") : formData.permissions as string || ""}
                            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                        <Bouton onClick={() => modifierRole(role.id)}>
                          <Save className="size-4" />
                          Enregistrer
                        </Bouton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-principal)]/10">
                          <Shield className="size-5 text-[var(--accent-principal)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{role.libelle}</p>
                            <Pastille ton={role.actif ? "succes" : "neutre"}>
                              {role.actif ? "Actif" : "Inactif"}
                            </Pastille>
                          </div>
                          <p className="text-sm text-[var(--texte-secondaire)]">{role.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {role.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="rounded-md bg-[var(--surface-mute)] px-2 py-0.5 text-xs text-[var(--texte-secondaire)]"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bouton
                          taille="sm"
                          variante="fantome"
                          onClick={() => toggleActifRole(role.id)}
                        >
                          {role.actif ? "Desactiver" : "Activer"}
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => commencerEdition(role.id, { ...role, permissions: role.permissions.join(", ") })}
                          disabled={!!modeEdition || modeAjout}
                        >
                          <Pencil className="size-4" />
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => supprimerRole(role.id)}
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Bouton>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "departements":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Departements</h3>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {departements.filter(d => d.actif).length} departement{departements.filter(d => d.actif).length > 1 ? "s" : ""} actif{departements.filter(d => d.actif).length > 1 ? "s" : ""}
                </p>
              </div>
              <Bouton onClick={commencerAjout} disabled={modeAjout || !!modeEdition}>
                <Plus className="size-4" />
                Ajouter
              </Bouton>
            </div>

            <AnimatePresence mode="popLayout">
              {modeAjout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-[var(--accent-principal)] bg-[var(--accent-principal)]/5 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Nouveau departement</h4>
                    <Bouton taille="icone" variante="fantome" onClick={resetForm}>
                      <X className="size-4" />
                    </Bouton>
                  </div>
                  <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette>Code</Etiquette>
                      <input
                        type="text"
                        value={formData.code as string || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="CODE"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Nom</Etiquette>
                      <input
                        type="text"
                        value={formData.nom as string || ""}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Nom du departement"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                    <Bouton onClick={ajouterDepartement}>
                      <Save className="size-4" />
                      Enregistrer
                    </Bouton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {departements.map((dept) => (
                <motion.div
                  key={dept.id}
                  layout
                  className={`rounded-xl border p-4 transition-colors ${
                    dept.actif 
                      ? "border-[var(--bordure)] bg-[var(--surface-elevee)]" 
                      : "border-[var(--bordure)]/50 bg-[var(--surface-mute)]/50 opacity-60"
                  }`}
                >
                  {modeEdition === dept.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Etiquette>Code</Etiquette>
                        <input
                          type="text"
                          value={formData.code as string || ""}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Etiquette>Nom</Etiquette>
                        <input
                          type="text"
                          value={formData.nom as string || ""}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Bouton taille="sm" variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                        <Bouton taille="sm" onClick={() => modifierDepartement(dept.id)}>
                          <Save className="size-4" />
                          Enregistrer
                        </Bouton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-principal)]/10">
                          <Building2 className="size-5 text-[var(--accent-principal)]" />
                        </div>
                        <div>
                          <p className="font-medium">{dept.nom}</p>
                          <p className="text-xs text-[var(--texte-secondaire)]">Code: {dept.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => commencerEdition(dept.id, dept)}
                          disabled={!!modeEdition || modeAjout}
                        >
                          <Pencil className="size-4" />
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => supprimerDepartement(dept.id)}
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Bouton>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "types-conges":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Types de conges</h3>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {typesConges.filter(t => t.actif).length} type{typesConges.filter(t => t.actif).length > 1 ? "s" : ""} actif{typesConges.filter(t => t.actif).length > 1 ? "s" : ""}
                </p>
              </div>
              <Bouton onClick={commencerAjout} disabled={modeAjout || !!modeEdition}>
                <Plus className="size-4" />
                Ajouter
              </Bouton>
            </div>

            <AnimatePresence mode="popLayout">
              {modeAjout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-[var(--accent-principal)] bg-[var(--accent-principal)]/5 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Nouveau type de conge</h4>
                    <Bouton taille="icone" variante="fantome" onClick={resetForm}>
                      <X className="size-4" />
                    </Bouton>
                  </div>
                  <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette>Code</Etiquette>
                      <input
                        type="text"
                        value={formData.code as string || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="code_conge"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Libelle</Etiquette>
                      <input
                        type="text"
                        value={formData.libelle as string || ""}
                        onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Nom du conge"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Jours maximum</Etiquette>
                      <input
                        type="number"
                        value={formData.joursMax as number || ""}
                        onChange={(e) => setFormData({ ...formData, joursMax: parseInt(e.target.value) || 0 })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="30"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="necessiteJustificatif"
                        checked={formData.necessiteJustificatif as boolean || false}
                        onChange={(e) => setFormData({ ...formData, necessiteJustificatif: e.target.checked })}
                        className="size-4 rounded border-[var(--bordure)]"
                      />
                      <Etiquette htmlFor="necessiteJustificatif" className="cursor-pointer">
                        Necessite un justificatif
                      </Etiquette>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                    <Bouton onClick={ajouterTypeConge}>
                      <Save className="size-4" />
                      Enregistrer
                    </Bouton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {typesConges.map((type) => (
                <motion.div
                  key={type.id}
                  layout
                  className={`rounded-xl border p-4 transition-colors ${
                    type.actif 
                      ? "border-[var(--bordure)] bg-[var(--surface-elevee)]" 
                      : "border-[var(--bordure)]/50 bg-[var(--surface-mute)]/50 opacity-60"
                  }`}
                >
                  {modeEdition === type.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Etiquette>Code</Etiquette>
                          <input
                            type="text"
                            value={formData.code as string || ""}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Etiquette>Libelle</Etiquette>
                          <input
                            type="text"
                            value={formData.libelle as string || ""}
                            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Etiquette>Jours maximum</Etiquette>
                          <input
                            type="number"
                            value={formData.joursMax as number || ""}
                            onChange={(e) => setFormData({ ...formData, joursMax: parseInt(e.target.value) || 0 })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                          <input
                            type="checkbox"
                            id={`edit-justificatif-${type.id}`}
                            checked={formData.necessiteJustificatif as boolean || false}
                            onChange={(e) => setFormData({ ...formData, necessiteJustificatif: e.target.checked })}
                            className="size-4 rounded border-[var(--bordure)]"
                          />
                          <Etiquette htmlFor={`edit-justificatif-${type.id}`} className="cursor-pointer">
                            Necessite un justificatif
                          </Etiquette>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                        <Bouton onClick={() => modifierTypeConge(type.id)}>
                          <Save className="size-4" />
                          Enregistrer
                        </Bouton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-principal)]/10">
                          <Calendar className="size-5 text-[var(--accent-principal)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{type.libelle}</p>
                            <Pastille ton={type.actif ? "succes" : "neutre"}>
                              {type.actif ? "Actif" : "Inactif"}
                            </Pastille>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[var(--texte-secondaire)]">
                            <span>Max: {type.joursMax} jours</span>
                            {type.necessiteJustificatif && (
                              <span className="flex items-center gap-1 text-amber-600">
                                <AlertCircle className="size-3" />
                                Justificatif requis
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bouton
                          taille="sm"
                          variante="fantome"
                          onClick={() => toggleActifTypeConge(type.id)}
                        >
                          {type.actif ? "Desactiver" : "Activer"}
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => commencerEdition(type.id, type)}
                          disabled={!!modeEdition || modeAjout}
                        >
                          <Pencil className="size-4" />
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => supprimerTypeConge(type.id)}
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Bouton>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "regles-validation":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Regles de validation</h3>
                <p className="text-sm text-[var(--texte-secondaire)]">
                  {reglesValidation.filter(r => r.actif).length} regle{reglesValidation.filter(r => r.actif).length > 1 ? "s" : ""} active{reglesValidation.filter(r => r.actif).length > 1 ? "s" : ""}
                </p>
              </div>
              <Bouton onClick={commencerAjout} disabled={modeAjout || !!modeEdition}>
                <Plus className="size-4" />
                Ajouter
              </Bouton>
            </div>

            <AnimatePresence mode="popLayout">
              {modeAjout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-[var(--accent-principal)] bg-[var(--accent-principal)]/5 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Nouvelle regle de validation</h4>
                    <Bouton taille="icone" variante="fantome" onClick={resetForm}>
                      <X className="size-4" />
                    </Bouton>
                  </div>
                  <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Etiquette>Nom</Etiquette>
                      <input
                        type="text"
                        value={formData.nom as string || ""}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Nom de la regle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiquette>Delai de validation (jours)</Etiquette>
                      <input
                        type="number"
                        value={formData.delaiValidationJours as number || ""}
                        onChange={(e) => setFormData({ ...formData, delaiValidationJours: parseInt(e.target.value) || 0 })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Etiquette>Description</Etiquette>
                      <input
                        type="text"
                        value={formData.description as string || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                        placeholder="Description de la regle..."
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="notificationAuto"
                        checked={formData.notificationAuto as boolean || false}
                        onChange={(e) => setFormData({ ...formData, notificationAuto: e.target.checked })}
                        className="size-4 rounded border-[var(--bordure)]"
                      />
                      <Etiquette htmlFor="notificationAuto" className="cursor-pointer">
                        Notification automatique
                      </Etiquette>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                    <Bouton onClick={ajouterRegleValidation}>
                      <Save className="size-4" />
                      Enregistrer
                    </Bouton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {reglesValidation.map((regle) => (
                <motion.div
                  key={regle.id}
                  layout
                  className={`rounded-xl border p-4 transition-colors ${
                    regle.actif 
                      ? "border-[var(--bordure)] bg-[var(--surface-elevee)]" 
                      : "border-[var(--bordure)]/50 bg-[var(--surface-mute)]/50 opacity-60"
                  }`}
                >
                  {modeEdition === regle.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Etiquette>Nom</Etiquette>
                          <input
                            type="text"
                            value={formData.nom as string || ""}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Etiquette>Delai (jours)</Etiquette>
                          <input
                            type="number"
                            value={formData.delaiValidationJours as number || ""}
                            onChange={(e) => setFormData({ ...formData, delaiValidationJours: parseInt(e.target.value) || 0 })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Etiquette>Description</Etiquette>
                          <input
                            type="text"
                            value={formData.description as string || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="h-10 w-full rounded-lg border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`edit-notif-${regle.id}`}
                            checked={formData.notificationAuto as boolean || false}
                            onChange={(e) => setFormData({ ...formData, notificationAuto: e.target.checked })}
                            className="size-4 rounded border-[var(--bordure)]"
                          />
                          <Etiquette htmlFor={`edit-notif-${regle.id}`} className="cursor-pointer">
                            Notification automatique
                          </Etiquette>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Bouton variante="secondaire" onClick={resetForm}>Annuler</Bouton>
                        <Bouton onClick={() => modifierRegleValidation(regle.id)}>
                          <Save className="size-4" />
                          Enregistrer
                        </Bouton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-principal)]/10">
                          <Clock className="size-5 text-[var(--accent-principal)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{regle.nom}</p>
                            <Pastille ton={regle.actif ? "succes" : "neutre"}>
                              {regle.actif ? "Active" : "Inactive"}
                            </Pastille>
                          </div>
                          <p className="text-sm text-[var(--texte-secondaire)]">{regle.description}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-[var(--texte-secondaire)]">
                            <span>Delai: {regle.delaiValidationJours} jours</span>
                            {regle.notificationAuto && (
                              <span className="text-[var(--accent-principal)]">Notifications actives</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bouton
                          taille="sm"
                          variante="fantome"
                          onClick={() => toggleActifRegleValidation(regle.id)}
                        >
                          {regle.actif ? "Desactiver" : "Activer"}
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => commencerEdition(regle.id, regle)}
                          disabled={!!modeEdition || modeAjout}
                        >
                          <Pencil className="size-4" />
                        </Bouton>
                        <Bouton
                          taille="icone"
                          variante="fantome"
                          onClick={() => supprimerRegleValidation(regle.id)}
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Bouton>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <EntetePage
        classNameZoneIcone="bg-[var(--accent-principal)]/10"
        icone={<Settings className="size-5 sm:size-6 text-[var(--accent-principal)]" />}
        titre="Parametrage"
        description="Configurez les parametres metier de l&apos;application MUFER Gestion-Employes"
      />

      <div className="grid gap-2 sm:gap-4 lg:gap-6 lg:grid-cols-[280px_1fr]">
        {/* Navigation laterale */}
        <div className="space-y-2">
          {onglets.map((onglet) => (
            <button
              key={onglet.id}
              onClick={() => {
                setOngletActif(onglet.id);
                resetForm();
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all ${
                ongletActif === onglet.id
                  ? "border border-[var(--accent-principal)]/30 bg-[var(--accent-principal)]/10 text-[var(--accent-principal)]"
                  : "border border-transparent bg-[var(--surface-elevee)] text-[var(--texte-principal)] hover:bg-[var(--surface-mute)]"
              }`}
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${
                ongletActif === onglet.id
                  ? "bg-[var(--accent-principal)]/20"
                  : "bg-[var(--surface-mute)]"
              }`}>
                {onglet.icone}
              </div>
              <div className="flex-1">
                <p className="font-medium">{onglet.libelle}</p>
                <p className="text-xs text-[var(--texte-secondaire)]">{onglet.description}</p>
              </div>
              <ChevronRight className={`size-4 transition-transform ${
                ongletActif === onglet.id ? "rotate-90" : ""
              }`} />
            </button>
          ))}
        </div>

        {/* Contenu */}
        <Carte>
          <CarteContenu className="pt-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={ongletActif}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContenu()}
              </motion.div>
            </AnimatePresence>
          </CarteContenu>
        </Carte>
      </div>
    </div>
  );
}
