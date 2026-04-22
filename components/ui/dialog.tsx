"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialogue = DialogPrimitive.Root;
const DeclencheurDialogue = DialogPrimitive.Trigger;
const FermerDialogue = DialogPrimitive.Close;

const PortailDialogue = DialogPrimitive.Portal;

const SuperpositionDialogue = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
SuperpositionDialogue.displayName = DialogPrimitive.Overlay.displayName;

const ContenuDialogue = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PortailDialogue>
    <SuperpositionDialogue />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-1rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-3 border border-[var(--bordure)] bg-[var(--surface-elevee)] p-4 shadow-xl duration-200",
        "max-h-[min(90dvh,calc(100vh-1rem))] overflow-y-auto overflow-x-hidden overscroll-contain",
        "rounded-lg sm:gap-4 sm:p-6 sm:rounded-[var(--rayon-lg)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-[var(--rayon-sm)] opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--anneau)] sm:right-4 sm:top-4 sm:size-8 sm:opacity-70">
        <X className="h-4 w-4" />
        <span className="sr-only">Fermer</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </PortailDialogue>
));
ContenuDialogue.displayName = DialogPrimitive.Content.displayName;

const EnteteDialogue = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 pr-8 text-left sm:pr-10", className)} {...props} />
);

const TitreDialogue = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-base font-semibold leading-snug tracking-tight sm:text-lg", className)}
    {...props}
  />
));
TitreDialogue.displayName = DialogPrimitive.Title.displayName;

const PiedDialogue = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:gap-3 sm:pt-0",
      className,
    )}
    {...props}
  />
);

export {
  ContenuDialogue,
  DeclencheurDialogue,
  Dialogue,
  EnteteDialogue,
  FermerDialogue,
  PiedDialogue,
  SuperpositionDialogue,
  TitreDialogue,
};
