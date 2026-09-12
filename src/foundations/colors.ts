/**
 * Bacon colour foundation.
 *
 * Brand Guide 03 — "The whole interface is navy and red on near-white. There is no secondary
 * brand colour and no tint ramp."
 *
 * Every value below is sampled from the exported Bacon artwork. This file is the ONLY place in
 * the package where a hex literal is permitted; the lint config enforces that.
 */

/**
 * The UI palette. These eight values are the entire interface.
 *
 * BRAND GUIDE REQUIREMENT: nothing may be added here without updating the whole library —
 * "a new colour introduced on one screen is not a local decision, it is a fork of the system."
 */
export const baconColors = {
  /** #132058 — brand, all body text on light, primary fills, the system background. */
  navy900: '#132058',
  /** #424C79 — navy + 20% white. Cards and grouped panels on a navy screen. No shadow, no border. */
  navy700: '#424C79',
  /** #555E86 — navy + 30% white. Buttons that sit inside a Navy 700 panel. */
  navy600: '#555E86',
  /** #DE0A26 — Signal Red. Over budget, zero remaining, destructive intent. Never decorative. */
  red: '#DE0A26',
  /** #FEFEFE — the app background on every money screen. Deliberately off pure white. */
  paper: '#FEFEFE',
  /** #FFFFFF — cards sitting on Paper. */
  white: '#FFFFFF',
  /** #E7E8EE — progress-bar track and hairline dividers. NEVER a text colour. */
  track: '#E7E8EE',
  /** #6B7396 — meta text on light only: targets, dates, locations, captions. */
  muted: '#6B7396',
} as const;

/**
 * Accessible variant of Signal Red.
 *
 * BRAND GUIDE REQUIREMENT (12 — Accessibility): white on #DE0A26 measures ~4.6:1, which passes
 * for the large amount on a red tile and fails for the 14pt meta line beneath it. The guide gives
 * two remedies: raise the meta text to 16pt/500, *or* "darken the fill to #C40A22 where small
 * copy is unavoidable". This library applies the first remedy by default and exposes the second
 * for surfaces that cannot avoid small copy.
 */
export const baconRedAccessible = '#C40A22' as const;

/**
 * Illustration-only accents.
 *
 * BRAND GUIDE REQUIREMENT: "Permitted inside line-art artwork. Never in UI chrome, never as a
 * status." They are deliberately exported from a separate object and are deliberately absent
 * from the theme, so that no component can reach them through `useBaconTheme()`.
 */
export const baconIllustrationColors = {
  violet: '#7B5FF1',
  lavender: '#E3E3FF',
  green: '#55D087',
} as const;

/**
 * Alpha overlays used on navy grounds.
 *
 * ENGINEERING DECISION: the guide renders secondary text on navy at reduced opacity but does not
 * name a token for it. These are derived from the guide's own stylesheet rather than invented.
 */
export const baconOnNavy = {
  /** Primary text on a navy ground. */
  text: baconColors.white,
  /** Secondary/meta text on a navy or red ground. Replaces `muted`, which is banned there. */
  textSecondary: 'rgba(255,255,255,0.82)',
  /** Meta text on a coloured surface — the guide's tile treatment. */
  textMeta: 'rgba(255,255,255,0.75)',
  /** Progress track on a navy surface. */
  track: 'rgba(255,255,255,0.25)',
  /** Hairline divider on a navy surface. */
  divider: 'rgba(255,255,255,0.18)',
} as const;

export type BaconColorName = keyof typeof baconColors;
export type BaconColorValue = (typeof baconColors)[BaconColorName];
export type BaconIllustrationColorName = keyof typeof baconIllustrationColors;

/**
 * Documented contrast ratios (Brand Guide 12). Exported so accessibility tests can assert
 * against the guide's own numbers rather than a re-measurement.
 */
export const baconContrast = {
  navyOnPaper: 13.2,
  whiteOnNavy900: 13.9,
  whiteOnNavy700: 6.6,
  whiteOnNavy600: 5.1,
  mutedOnPaper: 4.7,
  whiteOnRed: 4.6,
} as const;

/** The minimum point size at which muted grey is legible (Brand Guide 12). */
export const MUTED_MIN_FONT_SIZE = 14;
