import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variantesBouton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variante: {
        defaut:
          "bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] shadow-md shadow-[var(--accent-principal)]/20 hover:brightness-105 hover:shadow-lg hover:shadow-[var(--accent-principal)]/25 active:scale-[0.98]",
        principal:
          "bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] shadow-md shadow-[var(--accent-principal)]/20 hover:brightness-105 hover:shadow-lg hover:shadow-[var(--accent-principal)]/25 active:scale-[0.98]",
        secondaire:
          "border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] text-[var(--texte-principal)] hover:bg-[var(--surface-mute)] hover:border-[var(--bordure)]",
        fantome: "hover:bg-[var(--surface-mute)] text-[var(--texte-principal)]",
        lien: "text-[var(--accent-principal)] underline-offset-4 hover:underline",
        destructif:
          "bg-[var(--danger)] text-white shadow-md shadow-[var(--danger)]/20 hover:brightness-105",
      },
      taille: {
        defaut: "h-10 px-5 rounded-xl",
        sm: "h-8 px-3.5 text-xs rounded-lg",
        lg: "h-11 px-6 rounded-xl",
        icone: "size-9 rounded-xl",
      },
    },
    defaultVariants: {
      variante: "defaut",
      taille: "defaut",
    },
  },
);

export interface BoutonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantesBouton> {
  commeEnfant?: boolean;
}

const Bouton = React.forwardRef<HTMLButtonElement, BoutonProps>(
  ({ className, variante, taille, commeEnfant, ...props }, ref) => {
    const Comp = commeEnfant ? Slot : "button";
    return (
      <Comp
        className={cn(variantesBouton({ variante, taille, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Bouton.displayName = "Bouton";

export { Bouton, variantesBouton };
