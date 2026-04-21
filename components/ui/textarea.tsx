import * as React from "react";
import { cn } from "@/lib/utils";

const ZoneTexte = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[88px] w-full rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] px-3 py-2 text-sm text-[var(--texte-principal)] shadow-inner",
      "placeholder:text-[var(--texte-secondaire)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--anneau)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
ZoneTexte.displayName = "ZoneTexte";

export { ZoneTexte };
