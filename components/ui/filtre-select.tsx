"use client";

import * as React from "react";
import { ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionFiltre {
  valeur: string;
  libelle: string;
}

interface FiltreSelectProps {
  valeur: string;
  onChangerValeur: (valeur: string) => void;
  options: OptionFiltre[];
  placeholder?: string;
  label?: string;
  className?: string;
  avecIcone?: boolean;
}

export function FiltreSelect({
  valeur,
  onChangerValeur,
  options,
  placeholder = "Tous",
  label,
  className,
  avecIcone = true,
}: FiltreSelectProps) {
  return (
    <div className={cn("relative", className)}>
      {avecIcone && (
        <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)] pointer-events-none" />
      )}
      <select
        value={valeur}
        onChange={(e) => onChangerValeur(e.target.value)}
        aria-label={label || "Filtrer"}
        className={cn(
          "h-10 w-full appearance-none rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] pr-10 text-sm text-[var(--texte-principal)] transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)] focus-visible:ring-offset-2 focus-visible:border-[var(--accent-principal)]/50",
          avecIcone ? "pl-10" : "pl-4"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.valeur} value={opt.valeur}>
            {opt.libelle}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--texte-secondaire)] pointer-events-none" />
    </div>
  );
}
