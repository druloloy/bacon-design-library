import { type ViewStyle } from 'react-native';
import { baconColors } from './colors';
import { baconLayout } from './layout';
import { baconRadii } from './radii';

/**
 * Bacon accessibility foundation (Brand Guide 12).
 *
 * The guide lists five things "every build needs". They are implemented here once so that no
 * component has to remember them.
 */

/**
 * Expand a control's touch area to the 48pt minimum without changing how big it looks.
 *
 * BRAND GUIDE REQUIREMENT: "48pt minimum targets — current chips are 36pt tall and need padding,
 * not resizing." A chip must still *read* as 36pt tall.
 */
export interface BaconHitSlop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function hitSlopFor(
  visualSize: number,
  target = baconLayout.minTapTarget,
): BaconHitSlop {
  const deficit = Math.max(0, target - visualSize);
  const half = deficit / 2;
  return { top: half, bottom: half, left: half, right: half };
}

/** The chip hit slop, precomputed: 36pt visual → 48pt target. */
export const chipHitSlop: BaconHitSlop = hitSlopFor(baconLayout.chipVisualHeight);

export const FOCUS_RING_OFFSET = 2;
export const FOCUS_RING_WIDTH = 2;

/**
 * The focus ring: "2pt navy at 2pt offset, white on navy screens" (Brand Guide 12).
 *
 * ENGINEERING DECISION: the ring inherits the pill radius by default, because every focusable
 * control in Bacon is a pill.
 */
export function focusRing(onNavy: boolean, radius: number = baconRadii.pill): ViewStyle {
  return {
    borderWidth: FOCUS_RING_WIDTH,
    borderColor: onNavy ? baconColors.white : baconColors.navy900,
    borderRadius: radius,
  };
}

/**
 * Accessibility roles used across the library, named so call sites read as intent.
 *
 * BRAND GUIDE REQUIREMENT: "Chips announced as a radio group, not a list of buttons."
 */
export const baconA11yRoles = {
  chip: 'radio',
  chipGroup: 'radiogroup',
  button: 'button',
  link: 'link',
  header: 'header',
  progress: 'progressbar',
  toggle: 'switch',
} as const;

/**
 * Assert that a status is not being carried by colour alone.
 *
 * BRAND GUIDE REQUIREMENT: "Status never carried by colour alone: the red tile keeps its minus
 * sign and its 0%." Components call this to build the label a screen reader hears, so the state
 * is always spoken even when it is only drawn as a red surface.
 */
export function statusLabel(base: string, status?: string): string {
  return status ? `${base}, ${status}` : base;
}
