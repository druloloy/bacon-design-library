import { baconTokens } from '../foundations/tokens';
import { baconColors, baconOnNavy, baconRedAccessible } from '../foundations/colors';
import {
  defaultFontStrategy,
  baconFontFamilies,
  type BaconFontFamilyMap,
  type FontResolutionStrategy,
} from '../foundations/typography';

/**
 * The ground a component is currently drawn on.
 *
 * This is the load-bearing idea of the theme. Bacon has no light/dark *mode* — it has a semantic
 * background (Brand Guide 04) and a small set of surfaces that sit on it. Knowing the surface is
 * what lets every component pick a legal text colour without being told, and what makes the
 * guide's accessibility corrections structural:
 *
 *   - muted grey is only ever produced on a light surface;
 *   - meta text on a coloured surface is automatically the 16pt/500 role, not 14pt muted;
 *   - the progress track flips to a white outline on red and a 25% white fill on navy.
 */
export type BaconSurface = 'paper' | 'white' | 'navy' | 'panel' | 'red';

export interface SurfaceTreatment {
  /** The surface's own background colour. */
  readonly background: string;
  /** Primary text on this surface. */
  readonly text: string;
  /** Secondary/meta text on this surface. Never muted grey on a coloured ground. */
  readonly meta: string;
  /** True when this surface is navy or red — i.e. white-on-dark. */
  readonly onColor: boolean;
  /** The progress-bar track on this surface. `null` means "draw a white outline instead". */
  readonly track: string | null;
  /** Hairline divider colour. */
  readonly divider: string;
}

export interface BaconThemeConfig {
  /**
   * Use the darkened Signal Red (#C40A22) for filled red surfaces.
   *
   * BRAND GUIDE (12): the guide's second remedy for white-on-red contrast. Off by default,
   * because the library applies the first remedy (16pt/500 meta) everywhere instead.
   */
  readonly useAccessibleRed: boolean;
  readonly fontStrategy: FontResolutionStrategy;
  readonly fontFamilyMap: BaconFontFamilyMap;
}

export interface BaconTheme extends BaconThemeConfig {
  readonly tokens: typeof baconTokens;
  readonly surfaces: Record<BaconSurface, SurfaceTreatment>;
}

function buildSurfaces(useAccessibleRed: boolean): Record<BaconSurface, SurfaceTreatment> {
  const redFill = useAccessibleRed ? baconRedAccessible : baconColors.red;
  return {
    paper: {
      background: baconColors.paper,
      text: baconColors.navy900,
      meta: baconColors.muted,
      onColor: false,
      track: baconColors.track,
      divider: baconColors.track,
    },
    white: {
      background: baconColors.white,
      text: baconColors.navy900,
      meta: baconColors.muted,
      onColor: false,
      track: baconColors.track,
      divider: baconColors.track,
    },
    navy: {
      background: baconColors.navy900,
      text: baconColors.white,
      meta: baconOnNavy.textMeta,
      onColor: true,
      track: baconOnNavy.track,
      divider: baconOnNavy.divider,
    },
    panel: {
      background: baconColors.navy700,
      text: baconColors.white,
      meta: baconOnNavy.textMeta,
      onColor: true,
      track: baconOnNavy.track,
      divider: baconOnNavy.divider,
    },
    red: {
      background: redFill,
      text: baconColors.white,
      meta: baconOnNavy.textMeta,
      onColor: true,
      // BRAND GUIDE (09): "The red tile's progress bar loses its track and becomes a white
      // outline" — otherwise a full-width track reads as a bar that is already full.
      track: null,
      divider: baconOnNavy.divider,
    },
  };
}

export const defaultThemeConfig: BaconThemeConfig = {
  useAccessibleRed: false,
  fontStrategy: defaultFontStrategy,
  fontFamilyMap: baconFontFamilies,
};

export function createBaconTheme(config: Partial<BaconThemeConfig> = {}): BaconTheme {
  const merged: BaconThemeConfig = { ...defaultThemeConfig, ...config };
  return {
    ...merged,
    tokens: baconTokens,
    surfaces: buildSurfaces(merged.useAccessibleRed),
  };
}

export const baconTheme: BaconTheme = createBaconTheme();
