/**
 * Bacon spacing foundation.
 *
 * Brand Guide 07 — "4 · 8 · 12 · 20 · 40. Nothing else. If a gap wants to be 16, it is 12 or 20."
 */
export const baconSpacing = {
  /** 4 — the tightest optical gap: emoji to label, sign to numeral. */
  xs: 4,
  /** 8 — inside a small control. */
  sm: 8,
  /** 12 — between the lines of a tile. */
  md: 12,
  /** 20 — the screen gutter, the grid gap, and the gap within a section. */
  screen: 20,
  /** 40 — between sections. */
  section: 40,
} as const;

export type BaconSpacingToken = keyof typeof baconSpacing;
export type BaconSpacingValue = (typeof baconSpacing)[BaconSpacingToken];

/** The five permitted values, for tests and for the contribution guard. */
export const BACON_SPACING_SCALE: readonly number[] = [4, 8, 12, 20, 40];

/**
 * Aliases that read naturally at call sites. Deliberately NOT new values — the same five
 * numbers under the names the guide itself uses.
 */
export const baconGaps = {
  /** 20pt left and right, every screen. */
  gutter: baconSpacing.screen,
  /** 20pt within a section. */
  stack: baconSpacing.screen,
  /** 40pt between sections. */
  sectionGap: baconSpacing.section,
  /** 20pt column gap in the 2-up grid. */
  column: baconSpacing.screen,
} as const;
