"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Bouton } from "@/components/ui/button";
import type { DemandeConge } from "@/types";
import { libelleStatutConge } from "@/components/conges/libelles-conges";

export function CalendrierConges({ demandes }: { demandes: DemandeConge[] }) {
  const [moisCourant, setMoisCourant] = useState(() => startOfMonth(new Date()));

  const grille = useMemo(() => {
    const debut = startOfWeek(startOfMonth(moisCourant), { weekStartsOn: 1 });
    const fin = endOfWeek(endOfMonth(moisCourant), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: debut, end: fin });
  }, [moisCourant]);

  return (
    <div className="relative overflow-hidden rounded-[var(--rayon-lg)] border border-[var(--bordure)] bg-gradient-to-b from-[var(--surface-elevee)] to-[var(--surface-mute)]/50 p-4 shadow-[var(--ombre-douce)]">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-principal)]/50 to-transparent" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--texte-secondaire)]">
            Calendrier
          </p>
          <h3 className="text-lg font-semibold capitalize tracking-tight">
            {format(moisCourant, "MMMM yyyy", { locale: fr })}
          </h3>
        </div>
        <div className="flex gap-1">
          <Bouton
            taille="icone"
            variante="secondaire"
            onClick={() => setMoisCourant((d) => addMonths(d, -1))}
            aria-label="Mois précédent"
          >
            <ChevronLeft className="size-4" />
          </Bouton>
          <Bouton
            taille="icone"
            variante="secondaire"
            onClick={() => setMoisCourant((d) => addMonths(d, 1))}
            aria-label="Mois suivant"
          >
            <ChevronRight className="size-4" />
          </Bouton>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--texte-secondaire)]">
        {["lun", "mar", "mer", "jeu", "ven", "sam", "dim"].map((j) => (
          <span key={j} className="py-1">
            {j}
          </span>
        ))}
      </div>

      <motion.div layout className="mt-1 grid grid-cols-7 gap-1">
          {grille.map((jour) => {
            const dansMois = isSameMonth(jour, moisCourant);
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
            return (
              <motion.div
                layout
                key={jour.toISOString()}
                transition={{ duration: 0.2 }}
                className={`relative flex min-h-[52px] flex-col rounded-[var(--rayon-md)] border p-1.5 text-left text-[11px] ${
                  dansMois
                    ? "border-[var(--bordure)]/90 bg-[var(--surface-elevee)]/90"
                    : "border-transparent bg-transparent text-[var(--texte-secondaire)]/50"
                }`}
              >
                <span className="font-semibold tabular-nums">{format(jour, "d")}</span>
                <div className="mt-auto space-y-0.5">
                  {chevauche.slice(0, 2).map((d) => (
                    <div
                      key={d.id}
                      title={`${libelleStatutConge(d.statut)} — ${d.motif ?? ""}`}
                      className={`truncate rounded-[var(--rayon-sm)] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                        d.statut === "valide"
                          ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                          : d.statut === "refuse"
                            ? "bg-red-500/15 text-red-800 dark:text-red-200"
                            : "bg-[var(--accent-principal)]/25 text-[var(--texte-principal)]"
                      }`}
                    >
                      {d.type.slice(0, 3)}
                    </div>
                  ))}
                  {chevauche.length > 2 ? (
                    <span className="text-[9px] text-[var(--texte-secondaire)]">+{chevauche.length - 2}</span>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      <div className="mt-4 flex flex-wrap gap-3 text-[10px] text-[var(--texte-secondaire)]">
        <span className="inline-flex items-center gap-1">
          <span className="size-2 rounded-sm bg-[var(--accent-principal)]/40" /> En cours
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="size-2 rounded-sm bg-emerald-500/40" /> Validé
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="size-2 rounded-sm bg-red-500/40" /> Refusé
        </span>
      </div>
    </div>
  );
}
