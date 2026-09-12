/**
 * Bacon radius foundation (Brand Guide 07 / 14).
 *
 * Three radii, and they are semantic: a card is 16, a hero or sheet edge is 24, anything
 * pressable is a full pill.
 */
export const baconRadii = {
  /** 16 — cards, tiles, panels. */
  card: 16,
  /** 24 — hero bottom corners, bottom-sheet top corners. */
  hero: 24,
  /** 999 — buttons, chips, progress bars. "Everything the user can press is a full pill." */
  pill: 999,
} as const;

export type BaconRadiusToken = keyof typeof baconRadii;

export const BACON_RADIUS_SCALE: readonly number[] = [16, 24, 999];
