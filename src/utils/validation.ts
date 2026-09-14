import { BACON_SPACING_SCALE } from '../foundations/spacing';
import { BACON_RADIUS_SCALE } from '../foundations/radii';
import { baconColors, MUTED_MIN_FONT_SIZE } from '../foundations/colors';

/**
 * Development-time brand guards.
 *
 * Lint catches raw values in this repository; these catch them in a *consuming* app, where our
 * lint config does not run. Every guard is a no-op in production builds.
 */

// __DEV__ is injected by every React Native bundler; default to on if it is absent.
const isDev = typeof __DEV__ === 'undefined' ? true : __DEV__;

function warn(message: string): void {
  if (!isDev) return;
  // eslint-disable-next-line no-console
  console.warn(`[@druloloy/bacon-ui] ${message}`);
}

/** Brand Guide 07 — "4 · 8 · 12 · 20 · 40. Nothing else." */
export function assertSpacing(value: number, where: string): void {
  if (!BACON_SPACING_SCALE.includes(value)) {
    warn(
      `${where}: ${value} is not on the Bacon spacing scale (${BACON_SPACING_SCALE.join(' · ')}). ` +
        'If a gap wants to be 16, it is 12 or 20.',
    );
  }
}

/** Brand Guide 07 — three radii and no others. */
export function assertRadius(value: number, where: string): void {
  if (!BACON_RADIUS_SCALE.includes(value)) {
    warn(`${where}: ${value} is not a Bacon radius (16 card · 24 hero · 999 pill).`);
  }
}

/** Brand Guide 03 — the UI palette is closed. */
export function assertUiColor(value: string, where: string): void {
  const allowed: readonly string[] = Object.values(baconColors);
  if (!allowed.includes(value)) {
    warn(
      `${where}: "${value}" is not in the Bacon UI palette. ` +
        'Illustration accents are art-only and must never appear in UI chrome or as a status.',
    );
  }
}

/**
 * Brand Guide 12 — "Muted grey is fine for captions at 14pt and above. Do not use it under 14pt,
 * and never on a coloured surface."
 */
export function assertMutedUsage(
  fontSize: number,
  onColorSurface: boolean,
  where: string,
): void {
  if (onColorSurface) {
    warn(
      `${where}: muted grey is never legible on a coloured surface. ` +
        'Use the "metaOnColor" variant, which is 16pt / 500 as the guide requires.',
    );
    return;
  }
  if (fontSize < MUTED_MIN_FONT_SIZE) {
    warn(
      `${where}: muted grey is not used below ${MUTED_MIN_FONT_SIZE}pt (got ${fontSize}pt).`,
    );
  }
}
