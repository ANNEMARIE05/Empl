import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pastille = cva(
  "inline-flex items-center rounded-[var(--rayon-sm)] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
  {
    variants: {
      ton: {
        neutre: "border-[var(--bordure)] bg-[var(--surface-mute)] text-[var(--texte-secondaire)]",
        accent: "border-transparent bg-[var(--accent-principal)]/15 text-[var(--texte-principal)]",
        succes: "border-transparent bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
        alerte: "border-transparent bg-amber-500/15 text-amber-900 dark:text-amber-100",
        danger: "border-transparent bg-[var(--danger)]/15 text-red-800 dark:text-red-200",
      },
    },
    defaultVariants: { ton: "neutre" },
  },
);

export type PastilleProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof pastille>;

function Pastille({ className, ton, ...props }: PastilleProps) {
  return <div className={cn(pastille({ ton }), className)} {...props} />;
}

export { Pastille, pastille };
