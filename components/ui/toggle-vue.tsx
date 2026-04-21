"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type ModeVue = "grille" | "tableau";

interface ToggleVueProps {
  mode: ModeVue;
  onChangerMode: (mode: ModeVue) => void;
  className?: string;
}

export function ToggleVue({ mode, onChangerMode, className }: ToggleVueProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChangerMode("grille")}
        className={cn(
          "flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
          mode === "grille"
            ? "bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] shadow-sm"
            : "text-[var(--texte-secondaire)] hover:text-[var(--texte-principal)] hover:bg-[var(--surface-mute)]"
        )}
        aria-label="Vue grille"
        aria-pressed={mode === "grille"}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onChangerMode("tableau")}
        className={cn(
          "flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
          mode === "tableau"
            ? "bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] shadow-sm"
            : "text-[var(--texte-secondaire)] hover:text-[var(--texte-principal)] hover:bg-[var(--surface-mute)]"
        )}
        aria-label="Vue tableau"
        aria-pressed={mode === "tableau"}
      >
        <List className="size-4" />
      </button>
    </div>
  );
}

export type { ModeVue };
