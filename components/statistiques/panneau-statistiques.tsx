"use client";

import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { GrilleStatsKpi } from "@/components/ui/grille-stats-kpi";
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

const styleInfobulle = {
  borderRadius: "var(--rayon-md)",
  border: "1px solid var(--bordure)",
  background: "var(--surface-elevee)",
  color: "var(--texte-principal)",
  boxShadow: "var(--ombre-douce)",
};

/** Curseur SVG de l'infobulle : pas de remplissage ni trait visibles au survol */
const curseurOpaciteZero = { fillOpacity: 0, strokeOpacity: 0 };

export function PanneauStatistiques() {
  const { data, isLoading, isError } = useStatistiques(true);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-1.5 sm:gap-4 md:grid-cols-4">
        <Squelette className="h-24 sm:h-28" />
        <Squelette className="h-24 sm:h-28" />
        <Squelette className="h-24 sm:h-28" />
        <Squelette className="h-24 sm:h-28" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-[var(--danger)]">Statistiques indisponibles pour ce profil.</p>;
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      <GrilleStatsKpi colonnes={4}>
        <Carte className="min-w-0">
          <CarteEntete>
            <CarteTitre>Employés suivis</CarteTitre>
            <CarteDescription>Périmètre de votre vue.</CarteDescription>
          </CarteEntete>
          <CarteContenu>
            <p className="text-lg font-semibold tabular-nums sm:text-3xl">
              <NombreAnime valeur={data.volumeEmployesActifs} />
            </p>
          </CarteContenu>
        </Carte>
        <Carte className="min-w-0">
          <CarteEntete>
            <CarteTitre>Taux validation congés</CarteTitre>
          </CarteEntete>
          <CarteContenu>
            <p className="text-lg font-semibold tabular-nums sm:text-3xl">
              <NombreAnime valeur={data.tauxValidationConges} suffixe="%" />
            </p>
          </CarteContenu>
        </Carte>
        <Carte className="min-w-0">
          <CarteEntete>
            <CarteTitre>Délai moyen</CarteTitre>
          </CarteEntete>
          <CarteContenu>
            <p className="text-lg font-semibold tabular-nums sm:text-3xl">
              <NombreAnime valeur={data.delaiMoyenTraitementJours} decimales={1} suffixe=" j" />
            </p>
          </CarteContenu>
        </Carte>
        <Carte className="min-w-0">
          <CarteEntete>
            <CarteTitre>Charge documents</CarteTitre>
          </CarteEntete>
          <CarteContenu>
            <p className="text-lg font-semibold tabular-nums sm:text-3xl">
              <NombreAnime
                valeur={data.seriesMensuelles.reduce((a, b) => a + b.demandesDocuments, 0)}
              />
            </p>
          </CarteContenu>
        </Carte>
      </GrilleStatsKpi>

      <div className="grid gap-2 sm:gap-4 xl:grid-cols-2">
        <Carte>
          <CarteEntete>
            <CarteTitre>Flux congés / documents</CarteTitre>
            <CarteDescription>Séries empilées sur la période synthétique.</CarteDescription>
          </CarteEntete>
          <CarteContenu className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.seriesMensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--graphique-grille)" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 11, fill: "var(--graphique-axis)" }}
                  stroke="var(--graphique-grille)"
                />
                <YAxis tick={{ fontSize: 11, fill: "var(--graphique-axis)" }} stroke="var(--graphique-grille)" />
                <Tooltip
                  cursor={curseurOpaciteZero}
                  contentStyle={styleInfobulle}
                  labelStyle={{ color: "var(--texte-secondaire)" }}
                  itemStyle={{ color: "var(--texte-principal)" }}
                />
                <Legend wrapperStyle={{ color: "var(--texte-secondaire)" }} />
                <Area
                  type="monotone"
                  dataKey="demandesConges"
                  stackId="1"
                  stroke={accent}
                  fill={accent}
                  fillOpacity={0}
                  activeDot={false}
                  name="Congés"
                />
                <Area
                  type="monotone"
                  dataKey="demandesDocuments"
                  stackId="1"
                  stroke="var(--graphique-serie-alt)"
                  fill="var(--graphique-serie-alt-faible)"
                  fillOpacity={0}
                  activeDot={false}
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--graphique-grille)" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 11, fill: "var(--graphique-axis)" }}
                  stroke="var(--graphique-grille)"
                />
                <YAxis hide />
                <Tooltip
                  cursor={curseurOpaciteZero}
                  contentStyle={styleInfobulle}
                  labelStyle={{ color: "var(--texte-secondaire)" }}
                  itemStyle={{ color: "var(--texte-principal)" }}
                />
                <Line
                  type="monotone"
                  dataKey="absences"
                  stroke="var(--graphique-alerte)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  name="Absences"
                />
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--graphique-grille)" vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 11, fill: "var(--graphique-axis)" }}
                stroke="var(--graphique-grille)"
              />
              <YAxis tick={{ fontSize: 11, fill: "var(--graphique-axis)" }} stroke="var(--graphique-grille)" />
              <Tooltip
                cursor={curseurOpaciteZero}
                contentStyle={styleInfobulle}
                labelStyle={{ color: "var(--texte-secondaire)" }}
                itemStyle={{ color: "var(--texte-principal)" }}
              />
              <Legend wrapperStyle={{ color: "var(--texte-secondaire)" }} />
              <Bar dataKey="demandesConges" fill={accent} radius={[4, 4, 0, 0]} name="Congés" />
              <Bar dataKey="demandesDocuments" fill="var(--graphique-barre-documents)" radius={[4, 4, 0, 0]} name="Documents" />
            </BarChart>
          </ResponsiveContainer>
        </CarteContenu>
      </Carte>
    </div>
  );
}
