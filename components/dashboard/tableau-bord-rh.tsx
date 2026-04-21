"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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

const couleurAccent = "var(--accent-principal)";

export function TableauBordRh() {
  const { data: conges = [] } = useConges();
  const { data: documents = [] } = useDocuments();
  const { data: stats } = useStatistiques(true);

  const enAttenteConges = conges.filter((c) => c.statut === "en_attente").length;
  const enAttenteDocs = documents.filter((d) => d.statut === "en_attente" || d.statut === "en_traitement").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Carte className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent-principal)]/20 blur-2xl" />
          <CarteEntete>
            <CarteTitre>Congés à traiter</CarteTitre>
            <CarteDescription>Demandes en attente de validation RH.</CarteDescription>
          </CarteEntete>
          <CarteContenu>
            <p className="text-4xl font-semibold tracking-tight">
              <NombreAnime valeur={enAttenteConges} />
            </p>
          </CarteContenu>
        </Carte>
        <Carte>
          <CarteEntete>
            <CarteTitre>Documents en cours</CarteTitre>
            <CarteDescription>Files administratives actives.</CarteDescription>
          </CarteEntete>
          <CarteContenu>
            <p className="text-4xl font-semibold tracking-tight">
              <NombreAnime valeur={enAttenteDocs} />
            </p>
          </CarteContenu>
        </Carte>
        <Carte>
          <CarteEntete>
            <CarteTitre>Taux de validation</CarteTitre>
            <CarteDescription>Indicateur synthétique sur les congés.</CarteDescription>
          </CarteEntete>
          <CarteContenu>
            <p className="text-4xl font-semibold tracking-tight">
              <NombreAnime valeur={stats?.tauxValidationConges ?? 0} suffixe="%" />
            </p>
            <p className="mt-2 text-xs text-[var(--texte-secondaire)]">
              Délai moyen : <NombreAnime valeur={stats?.delaiMoyenTraitementJours ?? 0} decimales={1} /> j.
            </p>
          </CarteContenu>
        </Carte>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Carte className="overflow-hidden p-0">
          <div className="relative h-48 w-full">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-principal)]">
                Culture RH
              </p>
              <p className="mt-1 text-lg font-semibold">Aligner les équipes sur les priorités humaines.</p>
            </div>
          </div>
          <CarteContenu>
            <p className="text-sm text-[var(--texte-secondaire)]">
              Ce tableau de bord est volontairement distinct de celui des employés : indicateurs globaux, volumes et
              alertes de traitement.
            </p>
          </CarteContenu>
        </Carte>

        <motion.div layout className="grid gap-4">
          <Carte>
            <CarteEntete>
              <CarteTitre>Activité mensuelle</CarteTitre>
              <CarteDescription>Volume agrégé (données de démonstration).</CarteDescription>
            </CarteEntete>
            <CarteContenu className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.seriesMensuelles ?? []}>
                  <defs>
                    <linearGradient id="gConges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={couleurAccent} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={couleurAccent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="var(--texte-secondaire)" />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "var(--rayon-md)",
                      borderColor: "var(--bordure)",
                      background: "var(--surface-elevee)",
                    }}
                  />
                  <Area type="monotone" dataKey="demandesConges" stroke={couleurAccent} fill="url(#gConges)" />
                </AreaChart>
              </ResponsiveContainer>
            </CarteContenu>
          </Carte>
          <Carte>
            <CarteEntete>
              <CarteTitre>Répartition des statuts</CarteTitre>
            </CarteEntete>
            <CarteContenu className="grid gap-4 md:grid-cols-2">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.repartitionStatutsConges ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" vertical={false} />
                    <XAxis dataKey="nom" tick={{ fontSize: 10 }} stroke="var(--texte-secondaire)" />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "var(--rayon-md)",
                        borderColor: "var(--bordure)",
                        background: "var(--surface-elevee)",
                      }}
                    />
                    <Bar dataKey="valeur" radius={[4, 4, 0, 0]}>
                      {(stats?.repartitionStatutsConges ?? []).map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#22c55e" : i === 1 ? couleurAccent : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.repartitionTypesDocuments ?? []}
                      dataKey="valeur"
                      nameKey="nom"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {(stats?.repartitionTypesDocuments ?? []).map((_, i) => (
                        <Cell key={i} fill={i === 0 ? couleurAccent : i === 1 ? "#94a3b8" : "#0f172a"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "var(--rayon-md)",
                        borderColor: "var(--bordure)",
                        background: "var(--surface-elevee)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>
    </div>
  );
}
