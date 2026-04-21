"use client";

import { motion } from "framer-motion";

export function ChargeurPleinEcran({ texte = "MUFER Employés" }: { texte?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--surface-racine)]">
      <motion.div
        className="h-12 w-12 rounded-[var(--rayon-md)] border-2 border-[var(--bordure)] border-t-[var(--accent-principal)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--texte-secondaire)]"
      >
        {texte}
      </motion.p>
    </div>
  );
}
