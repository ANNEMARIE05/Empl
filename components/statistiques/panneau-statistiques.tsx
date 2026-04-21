"use client";

import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Squelette } from "@/components/ui/skeleton";
import { useStatistiques } from "@/hooks/queries/use-statistiques";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const accent = "var(--accent-principal)";

export function PanneauStatistiques() {
  const { data, isLoading, isError } = useStatistiques(true);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Squelette className="h-28" />
        <Squelette className="h-28" />
        <Squelette className="h-28" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-[var(--danger)]">Statistiques indisponibles pour ce profil.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Carte>
          <CarteEntete>
            <CarteTitre>Employés suivis</CarteTitre>
            <CarteDescription>Périmètre de votre vue.</CarteDescription>
          </CarteEntete>
          <CarteContenu>
            <p className="text-3xl font-semibold">
              <NombreAnime valeur={data.volumeEmployesActifs} />
            </p>
          </CarteContenu>
        </Carte>
        <Carte>
          <CarteEntete>
            <CarteTitre>Taux validation congés</CarteTitre>
          </CarteEntete>
          <CarteContenu>
            <p className="text-3xl font-semibold">
              <NombreAnime valeur={data.tauxValidationConges} suffixe="%" />
            </p>
          </CarteContenu>
        </Carte>
        <Carte>
          <CarteEntete>
            <CarteTitre>Délai moyen</CarteTitre>
          </CarteEntete>
          <CarteContenu>
            <p className="text-3xl font-semibold">
              <NombreAnime valeur={data.delaiMoyenTraitementJours} decimales={1} suffixe=" j" />
            </p>
          </CarteContenu>
        </Carte>
        <Carte>
          <CarteEntete>
            <CarteTitre>Charge documents</CarteTitre>
          </CarteEntete>
          <CarteContenu>
            <p className="text-3xl font-semibold">
              <NombreAnime
                valeur={data.seriesMensuelles.reduce((a, b) => a + b.demandesDocuments, 0)}
              />
            </p>
          </CarteContenu>
        </Carte>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Carte>
          <CarteEntete>
            <CarteTitre>Flux congés / documents</CarteTitre>
            <CarteDescription>Séries empilées sur la période synthétique.</CarteDescription>
          </CarteEntete>
          <CarteContenu className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.seriesMensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="var(--texte-secondaire)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--texte-secondaire)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--rayon-md)",
                    borderColor: "var(--bordure)",
                    background: "var(--surface-elevee)",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="demandesConges" stackId="1" stroke={accent} fill={`${accent}55`} name="Congés" />
                <Area
                  type="monotone"
                  dataKey="demandesDocuments"
                  stackId="1"
                  stroke="#0f172a"
                  fill="#0f172a33"
                  name="Documents"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CarteContenu>
        </Carte>

        <Carte>
          <CarteEntete>
            <CarteTitre>Absences signalées</CarteTitre>
            <CarteDescription>Indicateur corrélé (mock).</CarteDescription>
          </CarteEntete>
          <CarteContenu className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.seriesMensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="var(--texte-secondaire)" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--rayon-md)",
                    borderColor: "var(--bordure)",
                    background: "var(--surface-elevee)",
                  }}
                />
                <Line type="monotone" dataKey="absences" stroke="#f97316" strokeWidth={2} dot={false} name="Absences" />
              </LineChart>
            </ResponsiveContainer>
          </CarteContenu>
        </Carte>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Histogramme comparatif</CarteTitre>
        </CarteEntete>
        <CarteContenu className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.seriesMensuelles}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="var(--texte-secondaire)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--texte-secondaire)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "var(--rayon-md)",
                  borderColor: "var(--bordure)",
                  background: "var(--surface-elevee)",
                }}
              />
              <Legend />
              <Bar dataKey="demandesConges" fill={accent} radius={[4, 4, 0, 0]} name="Congés" />
              <Bar dataKey="demandesDocuments" fill="#334155" radius={[4, 4, 0, 0]} name="Documents" />
            </BarChart>
          </ResponsiveContainer>
        </CarteContenu>
      </Carte>
    </div>
  );
}
