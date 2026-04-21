import * as React from "react";
import { cn } from "@/lib/utils";

const Tableau = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto rounded-[var(--rayon-md)] border border-[var(--bordure)]">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Tableau.displayName = "Tableau";

const TableauEntete = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-[var(--surface-mute)]/60", className)} {...props} />
));
TableauEntete.displayName = "TableauEntete";

const TableauCorps = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableauCorps.displayName = "TableauCorps";

const TableauRangee = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--bordure)]/70 transition-colors hover:bg-[var(--surface-mute)]/40",
      className,
    )}
    {...props}
  />
));
TableauRangee.displayName = "TableauRangee";

const TableauCelluleEntete = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-3 text-left align-middle text-[10px] font-semibold uppercase tracking-wider text-[var(--texte-secondaire)]",
      className,
    )}
    {...props}
  />
));
TableauCelluleEntete.displayName = "TableauCelluleEntete";

const TableauCellule = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-3 align-middle text-[var(--texte-principal)]", className)} {...props} />
));
TableauCellule.displayName = "TableauCellule";

export { Tableau, TableauCellule, TableauCelluleEntete, TableauCorps, TableauEntete, TableauRangee };
