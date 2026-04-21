"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bouton } from "@/components/ui/button";

interface PaginationProps {
  pageActuelle: number;
  totalPages: number;
  onChangerPage: (page: number) => void;
  className?: string;
}

export function Pagination({ pageActuelle, totalPages, onChangerPage, className }: PaginationProps) {
  const genererNumeros = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageActuelle <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (pageActuelle >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = pageActuelle - 1; i <= pageActuelle + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <Bouton
        variante="fantome"
        taille="icone"
        onClick={() => onChangerPage(1)}
        disabled={pageActuelle === 1}
        aria-label="Premiere page"
      >
        <ChevronsLeft className="size-4" />
      </Bouton>
      <Bouton
        variante="fantome"
        taille="icone"
        onClick={() => onChangerPage(pageActuelle - 1)}
        disabled={pageActuelle === 1}
        aria-label="Page precedente"
      >
        <ChevronLeft className="size-4" />
      </Bouton>

      <div className="flex items-center gap-1">
        {genererNumeros().map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-[var(--texte-secondaire)]">
              ...
            </span>
          ) : (
            <Bouton
              key={page}
              variante={page === pageActuelle ? "principal" : "fantome"}
              taille="icone"
              onClick={() => onChangerPage(page)}
              className={cn(
                "min-w-[2.25rem] text-sm font-medium",
                page === pageActuelle && "pointer-events-none"
              )}
            >
              {page}
            </Bouton>
          )
        )}
      </div>

      <Bouton
        variante="fantome"
        taille="icone"
        onClick={() => onChangerPage(pageActuelle + 1)}
        disabled={pageActuelle === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight className="size-4" />
      </Bouton>
      <Bouton
        variante="fantome"
        taille="icone"
        onClick={() => onChangerPage(totalPages)}
        disabled={pageActuelle === totalPages}
        aria-label="Derniere page"
      >
        <ChevronsRight className="size-4" />
      </Bouton>
    </div>
  );
}
