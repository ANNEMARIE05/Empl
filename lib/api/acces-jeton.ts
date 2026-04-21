let recupererJeton: () => string | null = () => null;

export function definirRecuperateurJeton(fn: () => string | null) {
  recupererJeton = fn;
}

export function lireJetonCourant(): string | null {
  return recupererJeton();
}
