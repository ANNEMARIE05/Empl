"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, FileStack, TrendingUp } from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";
import { useStatistiques } from "@/hooks/queries/use-statistiques";
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

  const enAttenteConges = conges.filter((c) => c.statut === "en_attente").length;
  const enAttenteDocs = documents.filter((d) => d.statut === "en_attente" || d.statut === "en_traitement").length;

  return (
    <div className="space-y-6">
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
            <CarteTitre>Repartition des statuts</CarteTitre>
            <CarteDescription>Conges et documents</CarteDescription>
          </CarteEntete>
          <CarteContenu className="grid gap-4 md:grid-cols-2">
            <div className="h-52">
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
