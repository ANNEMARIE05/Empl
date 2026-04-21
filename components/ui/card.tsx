import * as React from "react";
import { cn } from "@/lib/utils";

function Carte({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--rayon-lg)] border border-[var(--bordure)]/80 bg-[var(--surface-elevee)]/90 shadow-[var(--ombre-douce)] backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

function CarteEntete({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-2", className)} {...props} />;
}

function CarteTitre({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold tracking-tight text-[var(--texte-principal)]", className)}
      {...props}
    />
  );
}

function CarteDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--texte-secondaire)]", className)} {...props} />
  );
}

function CarteContenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-2", className)} {...props} />;
}

export { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre };
