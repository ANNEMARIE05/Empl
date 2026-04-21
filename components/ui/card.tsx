import * as React from "react";
import { cn } from "@/lib/utils";

function Carte({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--bordure)]/50 bg-[var(--surface-elevee)] shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

function CarteEntete({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-5 pb-3", className)} {...props} />;
}

function CarteTitre({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-bold tracking-tight text-[var(--texte-principal)]", className)}
      {...props}
    />
  );
}

function CarteDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[var(--texte-secondaire)] leading-relaxed", className)} {...props} />
  );
}

function CarteContenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre };
