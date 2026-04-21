"use client";

export function FondApplicationDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-90"
    >
      <div className="absolute -left-24 top-32 h-72 w-72 rotate-12 rounded-[var(--rayon-lg)] border border-[var(--bordure)]/40 bg-[var(--accent-principal)]/10 blur-2xl" />
      <div className="absolute right-[-60px] top-10 h-64 w-64 rounded-full border border-[var(--bordure)]/30 bg-[var(--surface-mute)]/40 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-40 w-[120%] -translate-x-1/2 rotate-[-4deg] bg-gradient-to-r from-transparent via-[var(--accent-principal)]/12 to-transparent" />
    </div>
  );
}
