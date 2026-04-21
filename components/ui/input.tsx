import * as React from "react";
import { cn } from "@/lib/utils";

export type EntreeProps = React.InputHTMLAttributes<HTMLInputElement>;

const Entree = React.forwardRef<HTMLInputElement, EntreeProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 py-1 text-sm text-[var(--texte-principal)] shadow-inner transition-colors",
        "placeholder:text-[var(--texte-secondaire)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)]",
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
