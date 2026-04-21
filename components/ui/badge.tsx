import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pastille = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
  {
    variants: {
      ton: {
        neutre: "border-[var(--bordure)]/50 bg-[var(--surface-mute)]/80 text-[var(--texte-secondaire)]",
        accent: "border-[var(--accent-principal)]/20 bg-[var(--accent-principal)]/15 text-[var(--accent-principal)]",
        succes: "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        alerte: "border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300",
        danger: "border-[var(--danger)]/20 bg-[var(--danger)]/15 text-[var(--danger)]",
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
