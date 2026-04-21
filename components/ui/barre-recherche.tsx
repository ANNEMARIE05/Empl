"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BarreRechercheProps {
  valeur: string;
  onChangerValeur: (valeur: string) => void;
  placeholder?: string;
  className?: string;
}

export function BarreRecherche({
  valeur,
  onChangerValeur,
  placeholder = "Rechercher...",
  className,
}: BarreRechercheProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)]" />
      <input
        type="text"
        value={valeur}
        onChange={(e) => onChangerValeur(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] pl-10 pr-10 text-sm text-[var(--texte-principal)] transition-all duration-200",
          "placeholder:text-[var(--texte-secondaire)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)] focus-visible:ring-offset-2 focus-visible:border-[var(--accent-principal)]/50"
        )}
      />
      {valeur && (
        <button
          type="button"
          onClick={() => onChangerValeur("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--texte-secondaire)] hover:text-[var(--texte-principal)] transition-colors"
          aria-label="Effacer la recherche"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
