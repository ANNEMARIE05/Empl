import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variantesBouton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variante: {
        defaut:
          "bg-[var(--accent-principal)] text-[var(--texte-sur-accent)] shadow-sm hover:brightness-95 active:scale-[0.99]",
        secondaire:
          "border border-[var(--bordure)] bg-[var(--surface-elevee)] text-[var(--texte-principal)] hover:bg-[var(--surface-mute)]",
        fantome: "hover:bg-[var(--surface-mute)] text-[var(--texte-principal)]",
        lien: "text-[var(--accent-principal)] underline-offset-4 hover:underline",
        destructif:
          "bg-[var(--danger)] text-white hover:brightness-95",
      },
      taille: {
        defaut: "h-9 px-4 rounded-[var(--rayon-md)]",
        sm: "h-8 px-3 text-xs rounded-[var(--rayon-sm)]",
        lg: "h-10 px-6 rounded-[var(--rayon-md)]",
        icone: "size-9 rounded-[var(--rayon-md)]",
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
