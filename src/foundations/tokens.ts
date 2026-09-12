import {
  baconColors,
  baconIllustrationColors,
  baconOnNavy,
  baconRedAccessible,
} from './colors';
import { baconTypography } from './typography';
import { baconSpacing, baconGaps } from './spacing';
import { baconRadii } from './radii';
import { baconCardShadow, baconFlat } from './elevation';
import { baconLayout } from './layout';

/**
 * The complete Bacon token set, in one object.
 *
 * This is a *view* over the individual foundation modules, not a second copy of the values —
 * every token is defined exactly once, in its own file, and re-composed here.
 */
export const baconTokens = {
  colors: baconColors,
  redAccessible: baconRedAccessible,
  onNavy: baconOnNavy,
  /** Deliberately separate from `colors` — art only, never UI, never a status. */
  illustration: baconIllustrationColors,
  typography: baconTypography,
  spacing: baconSpacing,
  gaps: baconGaps,
  radii: baconRadii,
  elevation: { card: baconCardShadow, flat: baconFlat },
  layout: baconLayout,
} as const;

export type BaconTokens = typeof baconTokens;
