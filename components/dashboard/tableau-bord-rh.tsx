"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarCheck, FileStack, Users, Briefcase, CalendarOff } from "lucide-react";
import { NombreAnime } from "@/components/metrique/nombre-anime";
import { Pastille } from "@/components/ui/badge";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import {
  Tableau,
  TableauCellule,
  TableauCelluleEntete,
  TableauCorps,
  TableauEntete,
  TableauRangee,
} from "@/components/ui/table";
import { useConges } from "@/hooks/queries/use-conges";
import { useDocuments } from "@/hooks/queries/use-documents";
import { useEmployes } from "@/hooks/queries/use-employes";
import { useStatistiques } from "@/hooks/queries/use-statistiques";
import { banniereDashboardRh } from "@/lib/url-banniere-dashboard";
import { magasinApplication } from "@/stores/magasin-application";
import { creerAbsencesDemo, libelleStatutAbsence } from "@/lib/donnees-absences-demo";
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

const styleInfobulle = {
  borderRadius: "var(--rayon-md)",
  border: "1px solid var(--bordure)",
  background: "var(--surface-elevee)",
  color: "var(--texte-principal)",
  boxShadow: "var(--ombre-douce)",
};

const curseurOpaciteZero = { fillOpacity: 0, strokeOpacity: 0 };

export function TableauBordRh() {
  const router = useRouter();
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  const definirOngletActif = magasinApplication((s) => s.definirOngletActif);
  const apercuAbsencesRh = useMemo(() => creerAbsencesDemo().slice(0, 5), []);
  const { data: conges = [] } = useConges();
  const { data: documents = [] } = useDocuments();
  const { data: employes = [] } = useEmployes();
  const { data: stats } = useStatistiques(true);

  const enAttenteConges = conges.filter((c) => c.statut === "en_attente").length;
  const enAttenteDocs = documents.filter((d) => d.statut === "en_attente" || d.statut === "en_traitement").length;
  
  const totalEmployes = employes.length;
  const departementsUniques = new Set(employes.map((e) => e.departement)).size;

  if (!utilisateur) return null;

  const allerVersAbsences = () => {
    definirOngletActif("absences");
    router.replace("/?page=absences");
  };

  const imageHero = banniereDashboardRh;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="overflow-hidden rounded-xl border border-[var(--bordure)]/50 bg-gradient-to-r from-[var(--accent-principal)]/10 via-transparent to-[var(--accent-principal)]/5 dark:from-[var(--accent-principal)]/14 dark:via-transparent dark:to-[var(--accent-principal)]/6 sm:rounded-2xl">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[160px] w-full sm:min-h-[200px] md:min-h-[240px]">
            <img
              src={imageHero}
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover object-center"
              width={1200}
              height={800}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--surface-racine)]" />
          </div>
          <div className="flex flex-col justify-center space-y-2 p-4 sm:space-y-4 sm:p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-principal)]/30 bg-[var(--accent-principal)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-principal)] sm:px-3 sm:py-1 sm:text-[11px]">
              <span className="size-1.5 rounded-full bg-[var(--accent-principal)]" />
              Ressources humaines
            </div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Bonjour {utilisateur.prenom}
            </h2>
            <p className="text-xs text-[var(--texte-secondaire)] leading-relaxed sm:text-sm">
              Bienvenue dans votre espace RH. Pilotez les conges, les documents et l&apos;effectif depuis un meme tableau
              de bord.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-wrap gap-3 sm:gap-4 sm:flex-row sm:items-stretch">
        <motion.div
          className="min-w-0 sm:flex-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="relative h-full overflow-hidden">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent-principal)]/20 blur-2xl dark:bg-[var(--accent-principal)]/22" />
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15 dark:bg-[var(--accent-principal)]/18">
                  <Users className="size-5 text-[var(--accent-principal)]" />
                </div>
                <div>
                  <CarteTitre>Total employes</CarteTitre>
                  <CarteDescription>Effectif global</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-3xl font-bold text-[var(--accent-principal)] sm:text-4xl">
                <NombreAnime valeur={totalEmployes} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0 sm:flex-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-[var(--accent-principal)]/18">
                  <Briefcase className="size-5 text-emerald-600 dark:text-[var(--accent-principal)]" />
                </div>
                <div>
                  <CarteTitre>Departements</CarteTitre>
                  <CarteDescription>Services actifs</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-3xl font-bold text-emerald-600 dark:text-[var(--accent-principal)] sm:text-4xl">
                <NombreAnime valeur={departementsUniques} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0 sm:flex-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="relative h-full overflow-hidden">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent-principal)]/20 blur-2xl dark:bg-[var(--accent-principal)]/22" />
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15 dark:bg-[var(--accent-principal)]/18">
                  <CalendarCheck className="size-5 text-[var(--accent-principal)]" />
                </div>
                <div>
                  <CarteTitre>Conges a traiter</CarteTitre>
                  <CarteDescription>En attente</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-3xl font-bold text-[var(--accent-principal)] sm:text-4xl">
                <NombreAnime valeur={enAttenteConges} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>

        <motion.div
          className="min-w-0 sm:flex-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Carte className="h-full">
            <CarteEntete>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-[var(--accent-principal)]/18">
                  <FileStack className="size-5 text-blue-600 dark:text-[var(--accent-principal)]" />
                </div>
                <div>
                  <CarteTitre>Documents</CarteTitre>
                  <CarteDescription>En traitement</CarteDescription>
                </div>
              </div>
            </CarteEntete>
            <CarteContenu>
              <p className="text-3xl font-bold text-blue-600 dark:text-[var(--accent-principal)] sm:text-4xl">
                <NombreAnime valeur={enAttenteDocs} />
              </p>
            </CarteContenu>
          </Carte>
        </motion.div>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
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
                    <stop offset="5%" stopColor="var(--accent-principal)" stopOpacity={0} />
                    <stop offset="95%" stopColor="var(--accent-principal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--graphique-grille)" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "var(--graphique-axis)" }} stroke="var(--graphique-grille)" />
                <YAxis hide />
                <Tooltip
                  cursor={curseurOpaciteZero}
                  contentStyle={styleInfobulle}
                  labelStyle={{ color: "var(--texte-secondaire)" }}
                  itemStyle={{ color: "var(--texte-principal)" }}
                />
                <Area
                  type="monotone"
                  dataKey="demandesConges"
                  stroke="var(--accent-principal)"
                  strokeWidth={2}
                  fill="url(#gConges)"
                  activeDot={false}
                />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--graphique-grille)" vertical={false} />
                  <XAxis dataKey="nom" tick={{ fontSize: 10, fill: "var(--graphique-axis)" }} stroke="var(--graphique-grille)" />
                  <YAxis hide />
                  <Tooltip
                    cursor={curseurOpaciteZero}
                    contentStyle={styleInfobulle}
                    labelStyle={{ color: "var(--texte-secondaire)" }}
                    itemStyle={{ color: "var(--texte-principal)" }}
                  />
                  <Bar dataKey="valeur" radius={[8, 8, 0, 0]}>
                    {(stats?.repartitionStatutsConges ?? []).map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === 0
                            ? "var(--graphique-succes)"
                            : i === 1
                              ? "var(--accent-principal)"
                              : "var(--graphique-alerte)"
                        }
                      />
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
                      <Cell
                        key={i}
                        fill={
                          i === 0
                            ? "var(--accent-principal)"
                            : i === 1
                              ? "var(--graphique-serie-alt)"
                              : "var(--graphique-barre-documents)"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={curseurOpaciteZero}
                    contentStyle={styleInfobulle}
                    labelStyle={{ color: "var(--texte-secondaire)" }}
                    itemStyle={{ color: "var(--texte-principal)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CarteContenu>
        </Carte>
      </div>

      <Carte>
        <CarteEntete>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15 dark:bg-[var(--accent-principal)]/18">
                <CalendarOff className="size-5 text-[var(--accent-principal)]" />
              </div>
              <div className="min-w-0">
                <CarteTitre>Historique des absences</CarteTitre>
                <CarteDescription>
                  Apercu des demandes recentes : demandeur, motif, periode et statut.
                </CarteDescription>
              </div>
            </div>
            <Bouton
              type="button"
              variante="secondaire"
              taille="sm"
              className="shrink-0 self-start"
              onClick={allerVersAbsences}
            >
              Voir tout
            </Bouton>
          </div>
        </CarteEntete>
        <CarteContenu>
          <Tableau>
            <TableauEntete>
              <TableauRangee>
                <TableauCelluleEntete>Demandeur</TableauCelluleEntete>
                <TableauCelluleEntete>Motif</TableauCelluleEntete>
                <TableauCelluleEntete>Periode</TableauCelluleEntete>
                <TableauCelluleEntete>Statut</TableauCelluleEntete>
              </TableauRangee>
            </TableauEntete>
            <TableauCorps>
              {apercuAbsencesRh.map((l) => (
                <TableauRangee key={l.id}>
                  <TableauCellule className="text-sm text-[var(--texte-secondaire)]">
                    {l.employe}
                  </TableauCellule>
                  <TableauCellule className="break-words font-medium whitespace-pre-wrap">
                    {l.motif}
                  </TableauCellule>
                  <TableauCellule className="text-xs">
                    {format(l.du, "d MMMM yyyy", { locale: fr })}
                    {l.au ? (
                      <span className="text-[var(--texte-secondaire)]">
                        {" → "}
                        {format(l.au, "d MMMM yyyy", { locale: fr })}
                      </span>
                    ) : null}
                  </TableauCellule>
                  <TableauCellule>
                    <Pastille
                      ton={
                        l.statut === "justifiee"
                          ? "succes"
                          : l.statut === "en_attente"
                            ? "alerte"
                            : "danger"
                      }
                    >
                      {libelleStatutAbsence(l.statut)}
                    </Pastille>
                  </TableauCellule>
                </TableauRangee>
              ))}
            </TableauCorps>
          </Tableau>
        </CarteContenu>
      </Carte>
    </div>
  );
}
