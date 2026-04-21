"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  FileStack,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  Building2,
} from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";
import { useStatistiques } from "@/hooks/queries/use-statistiques";
import { useEmployes } from "@/hooks/queries/use-employes";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const couleurAccent = "#d4a500";

export function TableauBordRh() {
  const { data: conges = [] } = useConges();
  const { data: documents = [] } = useDocuments();
  const { data: stats } = useStatistiques(true);
  const { data: employes = [] } = useEmployes();

  const enAttenteConges = conges.filter((c) => c.statut === "en_attente").length;
  const enAttenteDocs = documents.filter((d) => d.statut === "en_attente" || d.statut === "en_traitement").length;

  // Stats employes
  const totalEmployes = employes.length;
  const employesActifs = employes.filter((e) => e.statut === "actif").length;
  const employesInactifs = employes.filter((e) => e.statut !== "actif").length;

  // Stats par departement
  const parDepartement = employes.reduce(
    (acc, e) => {
      acc[e.departement] = (acc[e.departement] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const departements = Object.entries(parDepartement)
    .map(([nom, valeur]) => ({ nom, valeur }))
    .sort((a, b) => b.valeur - a.valeur)
    .slice(0, 5);

  // Stats par role
  const parRole = employes.reduce(
    (acc, e) => {
      const roleLabel = e.role === "rh" ? "RH" : e.role === "manager" ? "Manager" : "Employe";
      acc[roleLabel] = (acc[roleLabel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const roles = Object.entries(parRole).map(([nom, valeur]) => ({ nom, valeur }));

  // Couleurs pour les graphiques
  const couleursDepart = ["#d4a500", "#3b82f6", "#22c55e", "#f97316", "#8b5cf6"];
  const couleursRoles = ["#d4a500", "#3b82f6", "#22c55e"];

  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="relative h-full overflow-hidden">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent-principal)]/20 blur-2xl" />
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
                  <CalendarCheck className="size-5 text-[var(--accent-principal)]" />
                </div>
                <div>
                  <CarteTitre>Conges a traiter</CarteTitre>
                  <CarteDescription>En attente</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-[var(--accent-principal)]">
                <NombreAnime valeur={enAttenteConges} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15">
                  <FileStack className="size-5 text-blue-600" />
                </div>
                <div>
                  <CarteTitre>Documents</CarteTitre>
                  <CarteDescription>En traitement</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-blue-600">
                <NombreAnime valeur={enAttenteDocs} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <TrendingUp className="size-5 text-emerald-600" />
                </div>
                <div>
                  <CarteTitre>Validation</CarteTitre>
                  <CarteDescription>Taux global</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-emerald-600">
                <NombreAnime valeur={stats?.tauxValidationConges ?? 0} suffixe="%" />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/15">
                  <Clock className="size-5 text-purple-600" />
                </div>
                <div>
                  <CarteTitre>Delai moyen</CarteTitre>
                  <CarteDescription>Traitement</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-purple-600">
                <NombreAnime valeur={stats?.delaiMoyenTraitementJours ?? 0} decimales={1} suffixe="j" />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>

      {/* Stats Employes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/15">
                  <Users className="size-5 text-indigo-600" />
                </div>
                <div>
                  <CarteTitre>Total Employes</CarteTitre>
                  <CarteDescription>Effectif global</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-indigo-600">
                <NombreAnime valeur={totalEmployes} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <UserCheck className="size-5 text-emerald-600" />
                </div>
                <div>
                  <CarteTitre>Employes Actifs</CarteTitre>
                  <CarteDescription>En poste</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-emerald-600">
                <NombreAnime valeur={employesActifs} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15">
                  <UserX className="size-5 text-orange-600" />
                </div>
                <div>
                  <CarteTitre>Inactifs</CarteTitre>
                  <CarteDescription>Absents / Autres</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-orange-600">
                <NombreAnime valeur={employesInactifs} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/15">
                  <Building2 className="size-5 text-cyan-600" />
                </div>
                <div>
                  <CarteTitre>Departements</CarteTitre>
                  <CarteDescription>Nombre total</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-4xl font-bold text-cyan-600">
                <NombreAnime valeur={Object.keys(parDepartement).length} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Carte>
          <CarteEntete>
            <CarteTitre>Activite mensuelle</CarteTitre>
            <CarteDescription>Evolution des demandes de conges</CarteDescription>
          </CarteEntete>
          <CarteContenu className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.seriesMensuelles ?? []}>
                <defs>
                  <linearGradient id="gConges" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={couleurAccent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={couleurAccent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="#888" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area type="monotone" dataKey="demandesConges" stroke={couleurAccent} strokeWidth={2} fill="url(#gConges)" />
              </AreaChart>
            </ResponsiveContainer>
          </CarteContenu>
        </Carte>

        <Carte>
          <CarteEntete>
            <CarteTitre>Repartition par departement</CarteTitre>
            <CarteDescription>Top 5 des departements</CarteDescription>
          </CarteEntete>
          <CarteContenu className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departements} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="nom" type="category" tick={{ fontSize: 11 }} stroke="#888" width={100} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="valeur" radius={[0, 8, 8, 0]}>
                  {departements.map((_, i) => (
                    <Cell key={i} fill={couleursDepart[i % couleursDepart.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CarteContenu>
        </Carte>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Repartition par role */}
        <Carte>
          <CarteEntete>
            <CarteTitre>Repartition par role</CarteTitre>
            <CarteDescription>Structure hierarchique</CarteDescription>
          </CarteEntete>
          <CarteContenu className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roles}
                  dataKey="valeur"
                  nameKey="nom"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  cornerRadius={4}
                  label={({ nom, percent }) => `${nom} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {roles.map((_, i) => (
                    <Cell key={i} fill={couleursRoles[i % couleursRoles.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CarteContenu>
        </Carte>

        {/* Repartition des statuts */}
        <Carte className="lg:col-span-2">
          <CarteEntete>
            <CarteTitre>Repartition des statuts</CarteTitre>
            <CarteDescription>Conges et documents</CarteDescription>
          </CarteEntete>
          <CarteContenu className="grid gap-4 md:grid-cols-2">
            <div className="h-52">
              <p className="mb-2 text-center text-xs font-medium text-[var(--texte-secondaire)]">Conges</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.repartitionStatutsConges ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="nom" tick={{ fontSize: 10 }} stroke="#888" />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e5e5",
                      background: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="valeur" radius={[8, 8, 0, 0]}>
                    {(stats?.repartitionStatutsConges ?? []).map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#22c55e" : i === 1 ? couleurAccent : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-52">
              <p className="mb-2 text-center text-xs font-medium text-[var(--texte-secondaire)]">Documents</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.repartitionTypesDocuments ?? []}
                    dataKey="valeur"
                    nameKey="nom"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    cornerRadius={4}
                  >
                    {(stats?.repartitionTypesDocuments ?? []).map((_, i) => (
                      <Cell key={i} fill={i === 0 ? couleurAccent : i === 1 ? "#64748b" : "#1e293b"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e5e5",
                      background: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CarteContenu>
        </Carte>
      </div>

      {/* Liste employes recents */}
      <Carte>
        <CarteEntete>
          <div className="flex items-center justify-between">
            <div>
              <CarteTitre>Employes recents</CarteTitre>
              <CarteDescription>Derniers employes ajoutes</CarteDescription>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-[var(--texte-tertiaire)]" />
              <span className="text-sm text-[var(--texte-secondaire)]">{totalEmployes} employes</span>
            </div>
          </div>
        </CarteEntete>
        <CarteContenu>
          <div className="space-y-3">
            {employes.slice(0, 5).map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--bordure)] bg-[var(--surface-survol)] p-3"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-principal)]/15 text-sm font-bold text-[var(--accent-principal)]">
                  {emp.prenom[0]}
                  {emp.nom[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-[var(--texte-principal)]">
                    {emp.prenom} {emp.nom}
                  </p>
                  <p className="truncate text-sm text-[var(--texte-secondaire)]">{emp.poste}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--texte-principal)]">{emp.departement}</p>
                  <p className="text-xs text-[var(--texte-tertiaire)]">
                    {emp.role === "rh" ? "RH" : emp.role === "manager" ? "Manager" : "Employe"}
                  </p>
                </div>
                <div
                  className={`size-2 rounded-full ${emp.statut === "actif" ? "bg-emerald-500" : "bg-orange-500"}`}
                />
              </div>
            ))}
          </div>
        </CarteContenu>
      </Carte>

      <Carte className="overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-48 md:h-auto md:min-h-[180px]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--surface-elevee)]" />
          </div>
          <div className="flex flex-col justify-center p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-principal)]/30 bg-[var(--accent-principal)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-principal)]">
              <span className="size-1.5 rounded-full bg-[var(--accent-principal)]" />
              Acces complet RH
            </div>
            <h3 className="mt-4 text-xl font-bold tracking-tight">Tableau de bord RH</h3>
            <p className="mt-2 text-sm text-[var(--texte-secondaire)] leading-relaxed">
              Vous disposez d&apos;un acces complet aux indicateurs, a la gestion des employes, des conges et des documents administratifs.
            </p>
          </div>
        </div>
      </Carte>
    </div>
  );
}
