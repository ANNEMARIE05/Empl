"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const MenuDeroulant = DropdownMenuPrimitive.Root;
const DeclencheurMenuDeroulant = DropdownMenuPrimitive.Trigger;

const ContenuMenuDeroulant = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-[var(--rayon-md)] border border-[var(--bordure)] bg-[var(--surface-elevee)] p-1 text-[var(--texte-principal)] shadow-lg",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
ContenuMenuDeroulant.displayName = DropdownMenuPrimitive.Content.displayName;

const ElementMenuDeroulant = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-[var(--rayon-sm)] px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--surface-mute)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
ElementMenuDeroulant.displayName = DropdownMenuPrimitive.Item.displayName;

const SeparateurMenuDeroulant = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[var(--bordure)]", className)}
    {...props}
  />
));
SeparateurMenuDeroulant.displayName = DropdownMenuPrimitive.Separator.displayName;

export {
  ContenuMenuDeroulant,
  DeclencheurMenuDeroulant,
  ElementMenuDeroulant,
  MenuDeroulant,
  SeparateurMenuDeroulant,
};
