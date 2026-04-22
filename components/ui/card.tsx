import * as React from "react";
import { cn } from "@/lib/utils";

function Carte({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--bordure)]/50 bg-[var(--surface-elevee)] shadow-sm transition-shadow hover:shadow-md dark:border-[var(--bordure)]/40 dark:shadow-none dark:hover:shadow-[0_8px_30px_-8px_oklch(0_0_0_/0.25)] sm:rounded-2xl",
        className,
      )}
      {...props}
    />
  );
}

function CarteEntete({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 pb-2 sm:gap-1.5 sm:p-5 sm:pb-3", className)} {...props} />
  );
}

function CarteTitre({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-bold tracking-tight text-[var(--texte-principal)] sm:text-base",
        className,
      )}
      {...props}
    />
  );
}

function CarteDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs text-[var(--texte-secondaire)] leading-relaxed sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CarteContenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-3 pt-0 sm:p-5 sm:pt-0", className)} {...props} />;
}

export { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre };
