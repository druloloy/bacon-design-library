import type { BaconTextRole } from '../../src/foundations/typography';
import {
  baconColors,
  baconIllustrationColors,
  baconRedAccessible,
  baconTypography,
  baconSpacing,
  BACON_SPACING_SCALE,
  baconRadii,
  baconLayout,
  baconTokens,
  BACON_FONT_STACK,
  baconFontWeights,
  MUTED_MIN_FONT_SIZE,
} from '../../src/foundations';
import { baconCardShadow, BACON_SHADOW_SPEC } from '../../src/foundations/elevation';
import * as elevation from '../../src/foundations/elevation';

/**
 * These tests do not check that the code works. They check that the *brand* still holds.
 * A failure here means someone has forked the Bacon system, not that a component is broken.
 */

describe('colour palette (Brand Guide 03)', () => {
  it('is exactly the eight documented UI colours', () => {
    expect(Object.keys(baconColors).sort()).toEqual(
      ['muted', 'navy600', 'navy700', 'navy900', 'paper', 'red', 'track', 'white'].sort(),
    );
  });

  it('holds the sampled values, unrounded', () => {
    expect(baconColors).toEqual({
      navy900: '#132058',
      navy700: '#424C79',
      navy600: '#555E86',
      red: '#DE0A26',
      paper: '#FEFEFE',
      white: '#FFFFFF',
      track: '#E7E8EE',
      muted: '#6B7396',
    });
  });

  it('keeps Paper off pure white so white cards can sit on it', () => {
    expect(baconColors.paper).not.toBe(baconColors.white);
  });

  it('has no amber, orange, or arbitrary green/blue/purple status colour', () => {
    const forbidden = [
      'amber',
      'orange',
      'green',
      'blue',
      'purple',
      'yellow',
      'warning',
      'success',
      'info',
    ];
    for (const name of Object.keys(baconColors)) {
      expect(forbidden).not.toContain(name.toLowerCase());
    }
  });

  it('keeps illustration accents out of the UI palette entirely', () => {
    const uiValues = Object.values(baconColors) as string[];
    for (const accent of Object.values(baconIllustrationColors)) {
      expect(uiValues).not.toContain(accent);
    }
  });

  it('does not expose illustration accents through the theme tokens', () => {
    const uiColorValues = Object.values(baconTokens.colors) as string[];
    expect(uiColorValues).not.toContain(baconIllustrationColors.violet);
    expect(uiColorValues).not.toContain(baconIllustrationColors.green);
    expect(uiColorValues).not.toContain(baconIllustrationColors.lavender);
  });

  it('offers the documented darkened red for small copy on a red fill', () => {
    expect(baconRedAccessible).toBe('#C40A22');
  });
});

describe('typography (Brand Guide 05 / 06)', () => {
  it('never exposes weight 600', () => {
    const weights = Object.values(baconTypography).map((role) => role.weight);
    expect(weights).not.toContain('600');
    expect(Object.values(baconFontWeights)).not.toContain('600');
  });

  it('uses only 300, 400, 500 and 700', () => {
    const allowed = ['300', '400', '500', '700'];
    for (const role of Object.values(baconTypography)) {
      expect(allowed).toContain(role.weight);
    }
  });

  it('leads the fallback stack with Quicksand and no grotesque substitute', () => {
    expect(BACON_FONT_STACK[0]).toBe('Quicksand');
    expect(BACON_FONT_STACK).not.toContain('Inter');
    expect(BACON_FONT_STACK).not.toContain('Roboto');
    expect(BACON_FONT_STACK).not.toContain('Helvetica');
  });

  it('matches the documented scale role for role', () => {
    expect(baconTypography.pageTitle).toMatchObject({
      weight: '300',
      fontSize: 34,
      lineHeightRatio: 1.15,
    });
    expect(baconTypography.heroMoney).toMatchObject({
      weight: '700',
      fontSize: 44,
      lineHeightRatio: 1.0,
    });
    expect(baconTypography.sectionHeading).toMatchObject({
      weight: '700',
      fontSize: 24,
      lineHeightRatio: 1.2,
    });
    expect(baconTypography.question).toMatchObject({
      weight: '700',
      fontSize: 22,
      lineHeightRatio: 1.25,
    });
    expect(baconTypography.cardTitle).toMatchObject({
      weight: '700',
      fontSize: 20,
      lineHeightRatio: 1.3,
    });
    expect(baconTypography.walletName).toMatchObject({
      weight: '400',
      fontSize: 20,
      lineHeightRatio: 1.3,
    });
    expect(baconTypography.label).toMatchObject({
      weight: '500',
      fontSize: 17,
      lineHeightRatio: 1.4,
    });
    expect(baconTypography.body).toMatchObject({
      weight: '400',
      fontSize: 17,
      lineHeightRatio: 1.45,
    });
    expect(baconTypography.meta).toMatchObject({
      weight: '400',
      fontSize: 14,
      lineHeightRatio: 1.4,
    });
    expect(baconTypography.navAction).toMatchObject({
      weight: '700',
      fontSize: 15,
      textTransform: 'uppercase',
    });
  });

  it('keeps the signature rhythm: Light title, Bold question, Regular value', () => {
    expect(baconTypography.pageTitle.weight).toBe('300');
    expect(baconTypography.question.weight).toBe('700');
    expect(baconTypography.body.weight).toBe('400');
  });

  it('raises meta on a coloured surface to 16pt / 500, the documented contrast fix', () => {
    expect(baconTypography.metaOnColor.fontSize).toBeGreaterThanOrEqual(16);
    expect(baconTypography.metaOnColor.weight).toBe('500');
    expect(baconTypography.meta.fontSize).toBe(MUTED_MIN_FONT_SIZE);
  });

  it('tracks and uppercases nav actions only', () => {
    const tracked = Object.entries(baconTypography).filter(
      ([, role]) => (role as BaconTextRole).textTransform === 'uppercase',
    );
    expect(tracked.map(([name]) => name)).toEqual(['navAction']);
  });
});

describe('spacing and geometry (Brand Guide 07)', () => {
  it('is the five-value scale and nothing else', () => {
    expect(Object.values(baconSpacing).sort((a, b) => a - b)).toEqual([4, 8, 12, 20, 40]);
    expect(BACON_SPACING_SCALE).toEqual([4, 8, 12, 20, 40]);
  });

  it('excludes the seductive intermediate values', () => {
    const values = Object.values(baconSpacing) as number[];
    for (const forbidden of [6, 10, 16, 18, 24, 32, 36, 48]) {
      expect(values).not.toContain(forbidden);
    }
  });

  it('has exactly three radii: card 16, hero 24, pill', () => {
    expect(baconRadii.card).toBe(16);
    expect(baconRadii.hero).toBe(24);
    expect(baconRadii.pill).toBeGreaterThanOrEqual(999);
    expect(Object.keys(baconRadii)).toHaveLength(3);
  });

  it('carries the measured frame geometry', () => {
    expect(baconLayout).toMatchObject({
      frameWidth: 360,
      frameHeight: 800,
      maxContentWidth: 480,
      gutter: 20,
      gridColumns: 2,
      columnWidth: 150,
      columnGap: 20,
      topBarHeight: 56,
      minTapTarget: 48,
      fabSize: 56,
      progressBarHeight: 20,
      rowLinkHeight: 88,
      buttonHeight: 48,
    });
    expect(baconLayout.heroHeight).toBeCloseTo(250, 0);
  });
});

describe('elevation (Brand Guide 07)', () => {
  it('is the one documented shadow', () => {
    expect(BACON_SHADOW_SPEC).toEqual({
      offsetX: 0,
      offsetY: 4,
      blur: 16,
      color: '#132058',
      opacity: 0.06,
    });
  });

  it('exposes no second elevation level', () => {
    const shadowExports = Object.keys(elevation).filter((key) => /shadow/i.test(key));
    expect(shadowExports.sort()).toEqual(['BACON_SHADOW_SPEC', 'baconCardShadow']);
  });

  it('is a soft navy shadow, never a black drop shadow', () => {
    expect(baconCardShadow.shadowColor).toBe('#132058');
  });
});
