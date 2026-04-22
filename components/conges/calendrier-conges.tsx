"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Bouton } from "@/components/ui/button";
import type { DemandeConge } from "@/types";
import { libelleStatutConge } from "@/components/conges/libelles-conges";
import { cn } from "@/lib/utils";

export function CalendrierConges({
  demandes,
  compact = false,
  className,
  jourSelectionne = null,
  onSelectionnerJour,
}: {
  demandes: DemandeConge[];
  compact?: boolean;
  className?: string;
  /** Jour utilisé comme filtre sur la liste (même jour = désactive le filtre). */
  jourSelectionne?: Date | null;
  onSelectionnerJour?: (jour: Date | null) => void;
}) {
  const [moisCourant, setMoisCourant] = useState(() => startOfMonth(new Date()));

  const grille = useMemo(() => {
    const debut = startOfWeek(startOfMonth(moisCourant), { weekStartsOn: 1 });
    const fin = endOfWeek(endOfMonth(moisCourant), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: debut, end: fin });
  }, [moisCourant]);

  const allerAujourdhui = () => setMoisCourant(startOfMonth(new Date()));

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] shadow-xl",
        className,
      )}
    >
      <div className="shrink-0 border-b border-[var(--bordure)]/60 bg-gradient-to-r from-[var(--accent-principal)]/5 via-transparent to-[var(--accent-principal)]/5 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-principal)]/15">
              <CalendarDays className="size-5 text-[var(--accent-principal)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold capitalize tracking-tight">
                {format(moisCourant, "MMMM yyyy", { locale: fr })}
              </h3>
              <p className="text-xs text-[var(--texte-secondaire)]">
                {onSelectionnerJour ? "Cliquez un jour pour filtrer la liste" : "Calendrier des conges"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bouton
              taille="sm"
              variante="fantome"
              onClick={allerAujourdhui}
              className="hidden text-xs sm:inline-flex"
            >
              Aujourd&apos;hui
            </Bouton>
            <div className="flex rounded-lg border border-[var(--bordure)]/60 bg-[var(--surface-mute)]/50 p-0.5">
              <Bouton
                taille="icone"
                variante="fantome"
                onClick={() => setMoisCourant((d) => addMonths(d, -1))}
                aria-label="Mois precedent"
                className="size-8 rounded-md"
              >
                <ChevronLeft className="size-4" />
              </Bouton>
              <Bouton
                taille="icone"
                variante="fantome"
                onClick={() => setMoisCourant((d) => addMonths(d, 1))}
                aria-label="Mois suivant"
                className="size-8 rounded-md"
              >
                <ChevronRight className="size-4" />
              </Bouton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="mb-2 grid shrink-0 grid-cols-7 gap-1">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((j) => (
            <div
              key={j}
              className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--texte-secondaire)]"
            >
              {j}
            </div>
          ))}
        </div>

        <motion.div
          layout
          className={cn(
            "grid min-h-0 grid-cols-7 gap-1",
            compact
              ? "max-h-full flex-1 content-start overflow-y-auto auto-rows-[minmax(52px,auto)]"
              : "flex-1 [grid-auto-rows:minmax(3.25rem,1fr)]",
          )}
        >
          {grille.map((jour) => {
            const dansMois = isSameMonth(jour, moisCourant);
            const estAujourdhui = isToday(jour);
            const estSelectionne =
              jourSelectionne != null && isSameDay(jourSelectionne, jour);
            const chevauche = demandes.filter((d) => {
              try {
                return isWithinInterval(jour, {
                  start: parseISO(d.dateDebut),
                  end: parseISO(d.dateFin),
                });
              } catch {
                return false;
              }
            });

            const gererClicJour = () => {
              if (!onSelectionnerJour) return;
              if (jourSelectionne != null && isSameDay(jourSelectionne, jour)) {
                onSelectionnerJour(null);
              } else {
                onSelectionnerJour(jour);
              }
            };

            return (
              <motion.div
                layout
                key={jour.toISOString()}
                transition={{ duration: 0.15 }}
                role={onSelectionnerJour ? "button" : undefined}
                tabIndex={onSelectionnerJour ? 0 : undefined}
                onClick={onSelectionnerJour ? gererClicJour : undefined}
                onKeyDown={
                  onSelectionnerJour
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          gererClicJour();
                        }
                      }
                    : undefined
                }
                aria-pressed={onSelectionnerJour ? estSelectionne : undefined}
                aria-label={
                  onSelectionnerJour
                    ? `${format(jour, "d MMMM yyyy", { locale: fr })}${chevauche.length ? `, ${chevauche.length} demande(s)` : ""}`
                    : undefined
                }
                className={`group relative flex ${compact ? "min-h-[52px]" : "min-h-[72px]"} flex-col rounded-xl border p-2 transition-all ${
                  onSelectionnerJour ? "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-principal)]/40" : ""
                } ${
                  estSelectionne
                    ? "border-[var(--accent-principal)] bg-[var(--accent-principal)]/20 shadow-md ring-2 ring-[var(--accent-principal)]/30"
                    : dansMois
                      ? estAujourdhui
                        ? "border-[var(--accent-principal)]/50 bg-[var(--accent-principal)]/10 shadow-sm"
                        : "border-[var(--bordure)]/40 bg-[var(--surface-racine)]/50 hover:border-[var(--bordure)] hover:bg-[var(--surface-mute)]/30"
                      : "border-transparent bg-transparent opacity-70 hover:bg-[var(--surface-mute)]/20"
                }`}
              >
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    dansMois
                      ? estAujourdhui
                        ? "text-[var(--accent-principal)]"
                        : "text-[var(--texte-principal)]"
                      : "text-[var(--texte-secondaire)]/40"
                  }`}
                >
                  {format(jour, "d")}
                </span>
                {estAujourdhui && dansMois && (
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[var(--accent-principal)]" />
                )}
                <div className="mt-auto flex flex-col gap-0.5">
                  {chevauche.slice(0, compact ? 1 : 2).map((d) => (
                    <div
                      key={d.id}
                      title={`${libelleStatutConge(d.statut)} - ${d.motif ?? ""}`}
                      className={`truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                        d.statut === "valide"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : d.statut === "refuse"
                            ? "bg-red-500/20 text-red-700 dark:text-red-300"
                            : "bg-[var(--accent-principal)]/20 text-[var(--texte-principal)]"
                      }`}
                    >
                      {compact ? "" : d.type.slice(0, 4)}
                    </div>
                  ))}
                  {chevauche.length > (compact ? 1 : 2) && (
                    <span className="text-[10px] font-medium text-[var(--texte-secondaire)]">
                      +{chevauche.length - (compact ? 1 : 2)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-auto shrink-0 border-t border-[var(--bordure)]/60 bg-[var(--surface-mute)]/30 px-5 py-3">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-md bg-[var(--accent-principal)]/30" />
            <span className="text-[var(--texte-secondaire)]">En attente</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-md bg-emerald-500/30" />
            <span className="text-[var(--texte-secondaire)]">Valide</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-md bg-red-500/30" />
            <span className="text-[var(--texte-secondaire)]">Refuse</span>
          </span>
        </div>
      </div>
    </div>
  );
}
