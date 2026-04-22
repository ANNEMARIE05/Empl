import * as React from "react";
import { cn } from "@/lib/utils";

export type EntetePageProps = {
  titre: string;
  description?: React.ReactNode;
  /** Contenu de la pastille d’icône (souvent un Lucide avec `className` type `size-5 sm:size-6`). */
  icone?: React.ReactNode;
  /** Surcharge des classes du conteneur de l’icône (fond, etc.). */
  classNameZoneIcone?: string;
  /** Bouton(s) à droite (souvent `w-full sm:w-auto` sur chaque bouton). */
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Bandeau de page (titre + sous-titre + action) : empilé sur mobile, aligné en ligne dès `sm+`.
 * À utiliser en tête des vues (annuaire, congés, documents, etc.) pour un rendu homogène.
 */
export function EntetePage({
  titre,
  description,
  icone,
  classNameZoneIcone,
  actions,
  className,
}: EntetePageProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
        {icone != null && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12 sm:rounded-2xl",
              classNameZoneIcone ?? "bg-[var(--accent-principal)]/15",
            )}
          >
            {icone}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-tight tracking-tight sm:text-xl">{titre}</h2>
          {description != null && (
            <p className="mt-0.5 text-xs leading-snug text-[var(--texte-secondaire)] sm:mt-1 sm:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions != null && <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">{actions}</div>}
    </div>
  );
}
