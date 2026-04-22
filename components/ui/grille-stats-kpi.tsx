import * as React from "react";
import { cn } from "@/lib/utils";

type Colonnes = 2 | 3 | 4;

const grilles: Record<Colonnes, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  /** 2×2 sur le plus étroit, puis 4 en ligne à partir de md. */
  4: "grid-cols-2 md:grid-cols-4",
};

type Props = {
  colonnes: Colonnes;
  className?: string;
  children: React.ReactNode;
};

/**
 * Grille d’indicateurs : 2×2 sur mobile quand {@link colonnes} vaut 4,
 * une ligne de 3 sur téléphone quand c’est 3, etc. Espacements serrés sur max-sm.
 */
export function GrilleStatsKpi({ colonnes, className, children }: Props) {
  return (
    <div
      className={cn(
        "grid w-full gap-1.5 sm:gap-3 md:gap-4",
        grilles[colonnes],
        className,
      )}
    >
      {children}
    </div>
  );
}
