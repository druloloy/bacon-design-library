/**
 * Bacon money formatting.
 *
 * Brand Guide 02 — "Currency is a glyph, a hard space, then comma grouping: ₱ 20,000. A change
 * trails the amount in regular weight so the amount stays dominant: ₱ 2,000 +50. Negative
 * balances keep the minus and turn the whole surface red: ₱ -110."
 *
 * Centralising this is the point: no screen reinvents currency rendering, so no screen can drop
 * the minus sign — which the accessibility rules depend on ("status never carried by colour
 * alone: the red tile keeps its minus sign").
 */

/** U+00A0. The guide specifies a *hard* space so the glyph never wraps away from the number. */
export const HARD_SPACE = '\u00A0';

export interface BaconCurrency {
  /** The glyph placed before the amount. */
  readonly symbol: string;
  /** Spoken name, used to build accessibility labels. */
  readonly name: string;
  /** Decimal places shown when the amount is not whole. */
  readonly fractionDigits: number;
}

/** Bacon's own currency. The library is Philippine-peso-first because the product is. */
export const PHP: BaconCurrency = { symbol: '₱', name: 'pesos', fractionDigits: 2 };

export interface FormatMoneyOptions {
  readonly currency?: BaconCurrency;
  /**
   * Show the currency glyph. Off for values that already sit inside a labelled context — the
   * progress-bar boundary chip, for instance, which shows `5,000` and not `₱ 5,000`.
   */
  readonly showSymbol?: boolean;
  /** Force decimals even on whole amounts. Off by default: the guide shows `₱ 20,000`. */
  readonly alwaysShowFraction?: boolean;
}

function groupDigits(
  value: number,
  fractionDigits: number,
  alwaysShowFraction: boolean,
): string {
  const isWhole = Number.isInteger(value);
  const digits = isWhole && !alwaysShowFraction ? 0 : fractionDigits;
  const abs = Math.abs(value);
  const fixed = abs.toFixed(digits);
  const [whole = '0', fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/**
 * `formatMoney(20000)` → `"₱ 20,000"` · `formatMoney(-110)` → `"₱ -110"`
 *
 * The minus sign sits between the glyph and the number, as the guide's own examples show.
 */
export function formatMoney(value: number, options: FormatMoneyOptions = {}): string {
  const { currency = PHP, showSymbol = true, alwaysShowFraction = false } = options;
  const sign = value < 0 ? '-' : '';
  const body = `${sign}${groupDigits(value, currency.fractionDigits, alwaysShowFraction)}`;
  return showSymbol ? `${currency.symbol}${HARD_SPACE}${body}` : body;
}

/**
 * `formatMoneyChange(2000, 50)` → `"₱ 2,000 +50"`
 *
 * The change trails the amount and is rendered in regular weight by BaconMoneyDisplay so the
 * amount stays dominant.
 */
export function formatMoneyChange(
  value: number,
  change: number,
  options: FormatMoneyOptions = {},
): string {
  return `${formatMoney(value, options)} ${formatChange(change, options)}`;
}

/** `formatChange(50)` → `"+50"` · `formatChange(-50)` → `"-50"`. Never `"+0"`. */
export function formatChange(change: number, options: FormatMoneyOptions = {}): string {
  const { currency = PHP, alwaysShowFraction = false } = options;
  const magnitude = groupDigits(change, currency.fractionDigits, alwaysShowFraction);
  if (change === 0) return magnitude;
  return `${change > 0 ? '+' : '-'}${magnitude}`;
}

/**
 * `formatTarget(25000)` → `"target 25,000"`
 *
 * Brand Guide 02: "Savings state their target in lower case."
 */
export function formatTarget(value: number, options: FormatMoneyOptions = {}): string {
  return `target ${formatMoney(value, { ...options, showSymbol: options.showSymbol ?? false })}`;
}

/**
 * `formatRemaining(0)` → `"0%"`
 *
 * Brand Guide 02: overview tiles state a percentage and the word *remaining* beneath it — never
 * "used". The word itself is supplied by StatTile, which does not accept an alternative.
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** `formatHandle('ddruu1')` → `"@ddruu1"`. Keep the handle, keep the "@" (Brand Guide 02). */
export function formatHandle(handle: string): string {
  const bare = handle.startsWith('@') ? handle.slice(1) : handle;
  return `@${bare}`;
}

/** `formatAttribution('ddruu1')` → `"Updated by @ddruu1"`. */
export function formatAttribution(handle: string): string {
  return `Updated by ${formatHandle(handle)}`;
}

/**
 * The masked form shown when a balance is hidden.
 *
 * IMPLEMENTATION DECISION (the guide says the eye "masks the figure in place" but does not
 * specify the mask): keep the glyph and the hard space so the row does not reflow, and replace
 * every digit and separator with a bullet.
 */
export function maskMoney(value: number, options: FormatMoneyOptions = {}): string {
  const { currency = PHP, showSymbol = true } = options;
  const digits = groupDigits(value, currency.fractionDigits, false).replace(
    /[\d.,]/g,
    '\u2022',
  );
  return showSymbol ? `${currency.symbol}${HARD_SPACE}${digits}` : digits;
}

/**
 * A spoken form of an amount, for `accessibilityLabel`.
 *
 * IMPLEMENTATION DECISION: screen readers pronounce "₱" inconsistently, so the label uses the
 * currency's spoken name and says "minus" rather than relying on the glyph.
 */
export function moneyAccessibilityLabel(
  value: number,
  options: FormatMoneyOptions = {},
): string {
  const { currency = PHP } = options;
  const magnitude = groupDigits(value, currency.fractionDigits, false);
  const sign = value < 0 ? 'minus ' : '';
  return `${sign}${magnitude} ${currency.name}`;
}
