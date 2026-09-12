/**
 * Bacon layout foundation (Brand Guide 07).
 *
 * "Bacon's screens put everything in the upper two thirds and leave the rest alone. The emptiness
 * is not an unfinished layout; it is the calm the brand is selling."
 */
export const baconLayout = {
  /** The design frame the library is measured against. */
  frameWidth: 360,
  frameHeight: 800,
  /** Layout stays fluid up to here, then stops growing and stays centred. */
  maxContentWidth: 480,
  /** 20pt left and right, every screen. */
  gutter: 20,
  /** 2 columns of 150pt with a 20pt gap, at the 360pt base width. */
  gridColumns: 2,
  columnWidth: 150,
  columnGap: 20,
  /** ≈250pt, content in the top 100pt. */
  heroHeight: 250,
  heroContentHeight: 100,
  /** 56pt, transparent, no shadow, no title. */
  topBarHeight: 56,
  /** 48pt minimum, everywhere. */
  minTapTarget: 48,
  /** 56pt navy circle, centred on the bottom edge. Money screens only. */
  fabSize: 56,
  /** 20pt tall pill (Brand Guide 09). */
  progressBarHeight: 20,
  /** 88pt tall (Brand Guide 09). */
  rowLinkHeight: 88,
  /** Chips are 36pt tall *visually*; the hit area is expanded to 48 without resizing them. */
  chipVisualHeight: 36,
  /** Buttons are 48pt tall with 28pt of side padding. */
  buttonHeight: 48,
  buttonPaddingHorizontal: 28,
  /** The input rule beneath a question value. */
  inputRuleHeight: 2,
} as const;

export type BaconLayoutToken = keyof typeof baconLayout;

/**
 * Width of one column in the 2-up grid at a given content width.
 *
 * ENGINEERING DECISION: the guide fixes the grid at 150pt on a 360pt frame and says the layout is
 * "fluid to 480". It does not say the tiles scale. Columns therefore stretch to fill the
 * available width — which preserves the 20pt gutter and 20pt gap exactly as documented — rather
 * than every measurement being scaled proportionally, which the brief explicitly warns against.
 */
export function columnWidthFor(
  contentWidth: number,
  columns = baconLayout.gridColumns,
): number {
  const usable = Math.min(contentWidth, baconLayout.maxContentWidth) - baconLayout.gutter * 2;
  const gaps = baconLayout.columnGap * (columns - 1);
  return Math.max(0, (usable - gaps) / columns);
}
