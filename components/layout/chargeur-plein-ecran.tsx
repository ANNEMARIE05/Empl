"use client";

import { motion } from "framer-motion";
import { Chargeur } from "@/components/ui/loader";

export function ChargeurPleinEcran({ texte = "MUFER Employés" }: { texte?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[color-mix(in_oklch,var(--surface-racine)_82%,transparent)] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <Chargeur taille="lg" variante="barres" />
        <motion.p
          className="text-sm font-medium text-[var(--texte-secondaire)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {texte}
        </motion.p>
      </div>
    </motion.div>
  );
}
