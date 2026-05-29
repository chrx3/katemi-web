/** Margen positivo: dispara animaciones antes de entrar al viewport al hacer scroll. */
export const IN_VIEW_MARGIN = "180px 0px 220px 0px";

/** Umbral bajo: basta con que una fracción mínima sea visible. */
export const IN_VIEW_AMOUNT = 0.05;

export const REVEAL_DURATION = 0.45;

export const REVEAL_EASE = [0.25, 0.46, 0.45, 0.94] as [
  number,
  number,
  number,
  number,
];

/** Limita delays escalonados para que el scroll no deje huecos vacíos. */
export function cappedRevealDelay(delay: number, max = 0.18): number {
  return Math.min(delay, max);
}
