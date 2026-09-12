import { Platform } from 'react-native';

/**
 * Bacon typography foundation.
 *
 * Brand Guide 05 — "One family carries the entire product." Quicksand's rounded terminals are
 * what make Bacon feel approachable while the colour stays severe. Substituting a grotesque
 * removes the warmth and the brand with it.
 */

/** The documented fallback stack (Brand Guide 05 / 14). */
export const BACON_FONT_STACK = [
  'Quicksand',
  'Nunito',
  'Poppins',
  'system-ui',
  'sans-serif',
] as const;

/**
 * The four weights Bacon uses.
 *
 * BRAND GUIDE REQUIREMENT: 600 is deliberately absent. "The identity depends on the gap between
 * Light and Bold; filling it in makes the hierarchy mushy." The type below makes a 600 weight a
 * compile error, not a review comment.
 */
export type BaconFontWeight = '300' | '400' | '500' | '700';

export const baconFontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
} as const satisfies Record<string, BaconFontWeight>;

/**
 * Named static font families, used when the app ships Quicksand as separate files.
 *
 * ENGINEERING DECISION (not a brand rule): Android does not reliably apply `fontWeight` to a
 * custom `fontFamily`; only the exact registered family name resolves. iOS handles weights on a
 * single family correctly. So the default resolution strategy is platform-split, and an app that
 * registers fonts differently can override the whole map on BaconThemeProvider.
 */
export const baconFontFamilies = {
  '300': 'Quicksand-Light',
  '400': 'Quicksand-Regular',
  '500': 'Quicksand-Medium',
  '700': 'Quicksand-Bold',
} as const satisfies Record<BaconFontWeight, string>;

export type BaconFontFamilyMap = Record<BaconFontWeight, string>;

export const BACON_FONT_FAMILY = 'Quicksand';

/**
 * How a weight becomes a concrete `fontFamily` / `fontWeight` pair.
 *
 * - `named`   — one registered file per weight (Android default, and the safest everywhere).
 * - `single`  — one family that carries all weights (iOS default, and web/variable fonts).
 */
export type FontResolutionStrategy = 'named' | 'single';

export const defaultFontStrategy: FontResolutionStrategy = Platform.select({
  android: 'named',
  default: 'single',
});

export interface ResolvedFont {
  fontFamily: string;
  fontWeight?: BaconFontWeight;
}

export function resolveFont(
  weight: BaconFontWeight,
  strategy: FontResolutionStrategy = defaultFontStrategy,
  familyMap: BaconFontFamilyMap = baconFontFamilies,
): ResolvedFont {
  if (strategy === 'named') {
    return { fontFamily: familyMap[weight] };
  }
  return { fontFamily: BACON_FONT_FAMILY, fontWeight: weight };
}

/**
 * The type scale (Brand Guide 06).
 *
 * "Only these roles exist; a new piece of text takes the nearest role rather than a new size."
 * Sizes are points on the 360pt frame. `lineHeight` is stored as a multiplier here and resolved
 * to an absolute value by BaconText so that Dynamic Type scaling stays proportional.
 */
export interface BaconTextRole {
  readonly weight: BaconFontWeight;
  readonly fontSize: number;
  readonly lineHeightRatio: number;
  readonly letterSpacing?: number;
  readonly textTransform?: 'uppercase';
  /** True when the role is specified as muted grey by default (Brand Guide 06). */
  readonly muted?: boolean;
}

export const baconTypography = {
  /** 300 · 34 / 1.15 — "Notifications". Centred. Names where you are. */
  pageTitle: { weight: '300', fontSize: 34, lineHeightRatio: 1.15 },
  /** 700 · 44 / 1.0 — "₱ 20,000". The largest element on any screen that has money on it. */
  heroMoney: { weight: '700', fontSize: 44, lineHeightRatio: 1.0 },
  /** 700 · 24 / 1.2 — "Budget Overview". */
  sectionHeading: { weight: '700', fontSize: 24, lineHeightRatio: 1.2 },
  /** 700 · 22 / 1.25 — "What do you want to do?". The thing being asked of the user. */
  question: { weight: '700', fontSize: 22, lineHeightRatio: 1.25 },
  /** 700 · 20 / 1.3 — "My Savings". */
  cardTitle: { weight: '700', fontSize: 20, lineHeightRatio: 1.3 },
  /** 400 · 20 / 1.3 — "Savings 1". */
  walletName: { weight: '400', fontSize: 20, lineHeightRatio: 1.3 },
  /** 500 · 17 / 1.4 — "Transportation". */
  label: { weight: '500', fontSize: 17, lineHeightRatio: 1.4 },
  /** 400 · 17 / 1.45 — "You have 4 active accounts". */
  body: { weight: '400', fontSize: 17, lineHeightRatio: 1.45 },
  /** 400 · 14 / 1.4 · muted — "target 25,000 · January 22, 2024". */
  meta: { weight: '400', fontSize: 14, lineHeightRatio: 1.4, muted: true },
  /** 700 · 15 · +.06em · uppercase — NEXT / FINISH / CLOSE. */
  navAction: {
    weight: '700',
    fontSize: 15,
    lineHeightRatio: 1.2,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  /**
   * 500 · 16 — meta text that sits on a Signal Red surface.
   *
   * BRAND GUIDE REQUIREMENT (12 — Accessibility): 14pt meta on red fails contrast. The guide's
   * first remedy is "raise meta text on a red surface to 16pt / 500". This role exists so that
   * fix is applied by construction rather than remembered.
   */
  metaOnColor: { weight: '500', fontSize: 16, lineHeightRatio: 1.4 },
  /**
   * 700 · 17 / 1.4 — the label inside a pill button.
   *
   * IMPLEMENTATION DECISION: the type scale (06) does not name a button role, but the component
   * spec (08) requires "a Bold label" on a 48pt pill. This reuses the documented 17pt body size
   * and takes only the weight from the component spec; it introduces no new size.
   */
  buttonLabel: { weight: '700', fontSize: 17, lineHeightRatio: 1.4 },
  /**
   * 700 · 14 / 1.2 — the value inside the progress bar's boundary chip.
   *
   * IMPLEMENTATION DECISION: same basis as `buttonLabel`. The component spec (09) draws this
   * value Bold inside a 20pt pill; the size is the documented 14pt meta size, unchanged.
   */
  progressValue: { weight: '700', fontSize: 14, lineHeightRatio: 1.2 },
} as const satisfies Record<string, BaconTextRole>;

export type BaconTextVariant = keyof typeof baconTypography;

/** Roles whose default colour is muted grey — used to enforce the 14pt muted floor. */
export const MUTED_VARIANTS: readonly BaconTextVariant[] = ['meta'];
