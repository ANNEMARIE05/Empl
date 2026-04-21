import * as React from "react";
import { cn } from "@/lib/utils";

export type EntreeProps = React.InputHTMLAttributes<HTMLInputElement>;

const Entree = React.forwardRef<HTMLInputElement, EntreeProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-[var(--bordure)]/60 bg-[var(--surface-elevee)] px-4 py-2 text-sm text-[var(--texte-principal)] transition-all duration-200",
        "placeholder:text-[var(--texte-secondaire)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)] focus-visible:ring-offset-2 focus-visible:border-[var(--accent-principal)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Entree.displayName = "Entree";

export { Entree };
