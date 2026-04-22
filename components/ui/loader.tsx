"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChargeurProps {
  taille?: "sm" | "md" | "lg";
  variante?: "spinner" | "points" | "pulse" | "barres";
  className?: string;
  texte?: string;
}

export function Chargeur({
  taille = "md",
  variante = "spinner",
  className,
  texte,
}: ChargeurProps) {
  const tailles = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  };

  if (variante === "spinner") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <motion.div
          className={cn(
            "rounded-full border-2 border-[var(--bordure)] border-t-[var(--accent-principal)]",
            tailles[taille],
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        {texte ? (
          <motion.span
            className="text-sm text-[var(--texte-secondaire)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {texte}
          </motion.span>
        ) : null}
      </div>
    );
  }

  if (variante === "points") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-[var(--accent-principal)]",
              taille === "sm" ? "size-1.5" : taille === "md" ? "size-2" : "size-3",
            )}
            animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
        {texte ? <span className="ml-2 text-sm text-[var(--texte-secondaire)]">{texte}</span> : null}
      </div>
    );
  }

  if (variante === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <motion.div
          className={cn("rounded-sm bg-[color-mix(in_oklch,var(--accent-principal)_30%,transparent)]", tailles[taille])}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        {texte ? <span className="text-sm text-[var(--texte-secondaire)]">{texte}</span> : null}
      </div>
    );
  }

  return (
    <div className={cn("flex items-end gap-1", className)}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-sm bg-[var(--accent-principal)]",
            taille === "sm" ? "w-1" : taille === "md" ? "w-1.5" : "w-2",
          )}
          animate={{ height: ["8px", "20px", "8px"] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
      {texte ? <span className="ml-2 text-sm text-[var(--texte-secondaire)]">{texte}</span> : null}
    </div>
  );
}
