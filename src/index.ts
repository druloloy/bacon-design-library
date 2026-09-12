/**
 * @bacon/design-system — the public API.
 *
 * Everything a consuming app may use is exported from here. Nothing is exported from an internal
 * path: `import { WalletTile } from '@bacon/design-system'` is the only supported form, and the
 * package's `exports` map makes deep imports unresolvable rather than merely discouraged.
 */

// ---------------------------------------------------------------------------------------------
// Foundations — the token layer
// ---------------------------------------------------------------------------------------------
export {
  baconColors,
  baconRedAccessible,
  baconIllustrationColors,
  baconOnNavy,
  baconContrast,
  MUTED_MIN_FONT_SIZE,
  type BaconColorName,
  type BaconColorValue,
  type BaconIllustrationColorName,
} from './foundations/colors';

export {
  baconTypography,
  baconFontWeights,
  baconFontFamilies,
  BACON_FONT_STACK,
  BACON_FONT_FAMILY,
  resolveFont,
  defaultFontStrategy,
  MUTED_VARIANTS,
  type BaconFontWeight,
  type BaconFontFamilyMap,
  type BaconTextVariant,
  type BaconTextRole,
  type FontResolutionStrategy,
  type ResolvedFont,
} from './foundations/typography';

export {
  baconSpacing,
  baconGaps,
  BACON_SPACING_SCALE,
  type BaconSpacingToken,
  type BaconSpacingValue,
} from './foundations/spacing';

export { baconRadii, BACON_RADIUS_SCALE, type BaconRadiusToken } from './foundations/radii';
export { baconCardShadow, baconFlat, BACON_SHADOW_SPEC } from './foundations/elevation';
export { baconLayout, columnWidthFor, type BaconLayoutToken } from './foundations/layout';
export {
  hitSlopFor,
  chipHitSlop,
  focusRing,
  statusLabel,
  baconA11yRoles,
  FOCUS_RING_OFFSET,
  FOCUS_RING_WIDTH,
  type BaconHitSlop,
} from './foundations/accessibility';
export { baconTokens, type BaconTokens } from './foundations/tokens';

// ---------------------------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------------------------
export {
  BaconThemeProvider,
  BaconSurfaceProvider,
  useBaconTheme,
  useBaconSurface,
  useOnColorSurface,
  baconTheme,
  createBaconTheme,
  defaultThemeConfig,
  type BaconThemeProviderProps,
  type UseBaconSurfaceResult,
  type BaconTheme,
  type BaconThemeConfig,
  type BaconSurface,
  type SurfaceTreatment,
} from './theme';

// ---------------------------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------------------------
export * from './atoms';

// ---------------------------------------------------------------------------------------------
// Molecules
// ---------------------------------------------------------------------------------------------
export * from './molecules';

// ---------------------------------------------------------------------------------------------
// Organisms
// ---------------------------------------------------------------------------------------------
export * from './organisms';

// ---------------------------------------------------------------------------------------------
// Templates — the four documented screen archetypes
// ---------------------------------------------------------------------------------------------
export * from './templates';

// ---------------------------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------------------------
export {
  formatMoney,
  formatMoneyChange,
  formatChange,
  formatTarget,
  formatPercent,
  formatHandle,
  formatAttribution,
  maskMoney,
  moneyAccessibilityLabel,
  HARD_SPACE,
  PHP,
  type BaconCurrency,
  type FormatMoneyOptions,
} from './utils/formatting';

export {
  walletAccessibilityLabel,
  statAccessibilityLabel,
  progressAccessibilityValue,
  type WalletStatus,
} from './utils/accessibility';

export {
  assertSpacing,
  assertRadius,
  assertUiColor,
  assertMutedUsage,
} from './utils/validation';

export type { EdgeInsets } from './types';
