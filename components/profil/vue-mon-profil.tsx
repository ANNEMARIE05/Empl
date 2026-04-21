"use client";

import { useMemo } from "react";
import { format, parseISO, differenceInYears, differenceInMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building,
  Briefcase,
  Calendar,
  CalendarDays,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  MapPin,
} from "lucide-react";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { magasinApplication } from "@/stores/magasin-application";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";

function libelleRole(role: string) {
  if (role === "rh") return "Ressources Humaines";
  if (role === "manager") return "Manager";
  return "Employe";
}

function calculerAnciennete(dateEmbauche: string) {
  const date = parseISO(dateEmbauche);
  const annees = differenceInYears(new Date(), date);
  const moisRestants = differenceInMonths(new Date(), date) % 12;
  
  if (annees === 0) {
    return `${moisRestants} mois`;
  }
  if (moisRestants === 0) {
    return `${annees} an${annees > 1 ? "s" : ""}`;
  }
  return `${annees} an${annees > 1 ? "s" : ""} et ${moisRestants} mois`;
}

export function VueMonProfil() {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const { data: conges = [] } = useConges();
  const { data: documents = [] } = useDocuments();

  const stats = useMemo(() => {
    const congesValides = conges.filter((c) => c.statut === "valide").length;
    const congesEnAttente = conges.filter((c) => c.statut === "en_attente").length;
    const congesRefuses = conges.filter((c) => c.statut === "refuse").length;
    const documentsTraites = documents.filter((d) => d.statut === "pret").length;
    const documentsEnCours = documents.filter((d) => d.statut === "en_attente" || d.statut === "en_traitement").length;
    
    return {
      totalConges: conges.length,
      congesValides,
      congesEnAttente,
      congesRefuses,
      totalDocuments: documents.length,
      documentsTraites,
      documentsEnCours,
      tauxValidation: conges.length > 0 ? Math.round((congesValides / conges.length) * 100) : 0,
    };
  }, [conges, documents]);

  if (!utilisateur) return null;

  const estRh = utilisateur.role === "rh";
  const estManager = utilisateur.role === "manager";

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Carte className="overflow-hidden">
        <div className="relative">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[var(--accent-principal)] via-[var(--accent-principal)]/80 to-[var(--accent-principal)]/60" />
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="size-24 sm:size-28 ring-4 ring-[var(--surface-elevee)] shadow-xl">
                  {utilisateur.photoUrl ? (
                    <AvatarImage src={utilisateur.photoUrl} alt="" />
                  ) : null}
                  <AvatarFallback className="bg-[var(--surface-mute)] text-2xl font-bold text-[var(--accent-principal)]">
                    {utilisateur.prenom[0]}{utilisateur.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[var(--surface-elevee)]">
                  <CheckCircle className="size-4 text-white" />
                </div>
              </div>

              {/* Name and Role */}
              <div className="flex-1 text-center sm:text-left sm:pb-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {utilisateur.prenom} {utilisateur.nom}
                </h1>
                <p className="text-[var(--texte-secondaire)]">{utilisateur.poste}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Pastille 
                    ton={estRh ? "accent" : estManager ? "alerte" : "neutre"}
                    className="text-xs"
                  >
                    {libelleRole(utilisateur.role)}
                  </Pastille>
                  <span className="text-xs text-[var(--texte-secondaire)] flex items-center gap-1">
                    <MapPin className="size-3" />
                    {utilisateur.departement}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carte>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full border-l-4 border-l-[var(--accent-principal)]">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                <CalendarDays className="size-6 text-[var(--accent-principal)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--accent-principal)]">
                  <NombreAnime valeur={stats.totalConges} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Demandes conges</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full border-l-4 border-l-emerald-500">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15">
                <CheckCircle className="size-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  <NombreAnime valeur={stats.congesValides} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Conges valides</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full border-l-4 border-l-blue-500">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15">
                <FileText className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  <NombreAnime valeur={stats.totalDocuments} />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Documents</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full border-l-4 border-l-purple-500">
            <CarteContenu className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/15">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  <NombreAnime valeur={stats.tauxValidation} suffixe="%" />
                </p>
                <p className="text-sm text-[var(--texte-secondaire)]">Taux validation</p>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Carte>
          <CarteEntete>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                <User className="size-5 text-[var(--accent-principal)]" />
              </div>
              <div>
                <CarteTitre>Informations personnelles</CarteTitre>
                <CarteDescription>Donnees visibles par votre organisation</CarteDescription>
              </div>
            </div>
          </CarteEntete>
          <CarteContenu className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-[var(--surface-mute)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--surface-elevee)]">
                <User className="size-5 text-[var(--texte-secondaire)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Nom complet</p>
                <p className="font-medium truncate">{utilisateur.prenom} {utilisateur.nom}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-[var(--surface-mute)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--surface-elevee)]">
                <Mail className="size-5 text-[var(--texte-secondaire)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Adresse email</p>
                <p className="font-medium truncate">{utilisateur.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-[var(--surface-mute)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--surface-elevee)]">
                <Building className="size-5 text-[var(--texte-secondaire)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Departement</p>
                <p className="font-medium truncate">{utilisateur.departement}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-[var(--surface-mute)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--surface-elevee)]">
                <Briefcase className="size-5 text-[var(--texte-secondaire)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Poste</p>
                <p className="font-medium truncate">{utilisateur.poste}</p>
              </div>
            </div>
          </CarteContenu>
        </Carte>

        {/* Employment Info */}
        <Carte>
          <CarteEntete>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                <Award className="size-5 text-emerald-600" />
              </div>
              <div>
                <CarteTitre>Informations professionnelles</CarteTitre>
                <CarteDescription>Votre parcours dans l&apos;entreprise</CarteDescription>
              </div>
            </div>
          </CarteEntete>
          <CarteContenu className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-[var(--surface-mute)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--surface-elevee)]">
                <Calendar className="size-5 text-[var(--texte-secondaire)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Date d&apos;embauche</p>
                <p className="font-medium">
                  {format(parseISO(utilisateur.dateEmbauche), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-[var(--surface-mute)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--surface-elevee)]">
                <Clock className="size-5 text-[var(--texte-secondaire)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Anciennete</p>
                <p className="font-medium">{calculerAnciennete(utilisateur.dateEmbauche)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-[var(--bordure)] p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-principal)]/10">
                <Award className="size-5 text-[var(--accent-principal)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--texte-secondaire)]">Role dans l&apos;organisation</p>
                <div className="mt-1">
                  <Pastille ton={estRh ? "accent" : estManager ? "alerte" : "neutre"}>
                    {libelleRole(utilisateur.role)}
                  </Pastille>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="rounded-xl bg-gradient-to-br from-[var(--accent-principal)]/10 to-transparent p-4">
              <p className="text-sm font-medium mb-3">Activite recente</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center rounded-lg bg-[var(--surface-elevee)] p-3">
                  <p className="text-lg font-bold text-[var(--accent-principal)]">{stats.congesEnAttente}</p>
                  <p className="text-xs text-[var(--texte-secondaire)]">En attente</p>
                </div>
                <div className="text-center rounded-lg bg-[var(--surface-elevee)] p-3">
                  <p className="text-lg font-bold text-emerald-600">{stats.documentsTraites}</p>
                  <p className="text-xs text-[var(--texte-secondaire)]">Docs traites</p>
                </div>
              </div>
            </div>
          </CarteContenu>
        </Carte>
      </div>

      {/* Access Level Info */}
      <Carte className="border-dashed">
        <CarteEntete>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface-mute)]">
              <Briefcase className="size-5 text-[var(--texte-secondaire)]" />
            </div>
            <div>
              <CarteTitre>{estRh ? "Acces RH etendu" : estManager ? "Acces Manager" : "Acces Employe"}</CarteTitre>
              <CarteDescription>
                Vos permissions et fonctionnalites disponibles
              </CarteDescription>
            </div>
          </div>
        </CarteEntete>
        <CarteContenu>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {estRh ? (
              <>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Acces complet aux workflows de validation</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Visibilite sur les notes internes RH</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Parametrage des types de conges et documents</p>
                </div>
              </>
            ) : estManager ? (
              <>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Validation des demandes de votre equipe</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Visibilite sur les absences de votre equipe</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Statistiques de votre departement</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Consultation de vos demandes personnelles</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Soumission de nouvelles demandes</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-mute)] p-3">
                  <CheckCircle className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Notifications sur votre perimetre</p>
                </div>
              </>
            )}
          </div>
        </CarteContenu>
      </Carte>
    </div>
  );
}
