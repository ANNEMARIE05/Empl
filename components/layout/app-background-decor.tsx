"use client";

/**
 * Fond décoratif commun (connexion, coquille applicative, etc.)
 */
export function AppBackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70 dark:opacity-[0.55]"
    >
      <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-[color-mix(in_oklch,var(--accent-principal)_18%,transparent)] blur-3xl dark:bg-[color-mix(in_oklch,var(--accent-principal)_16%,transparent)]" />
      <div className="absolute right-[-7rem] top-24 h-80 w-80 rounded-full bg-[color-mix(in_oklch,var(--graphique-alerte)_20%,transparent)] blur-3xl dark:bg-[color-mix(in_oklch,var(--surface-racine)_70%,white_4%)]" />
      <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-[color-mix(in_oklch,var(--graphique-succes)_14%,transparent)] blur-3xl dark:bg-[color-mix(in_oklch,var(--accent-principal)_8%,transparent)]" />
    </div>
  );
}
