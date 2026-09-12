import { moneyAccessibilityLabel, formatPercent, type FormatMoneyOptions } from './formatting';

/**
 * Label builders.
 *
 * BRAND GUIDE REQUIREMENT (12): "Status never carried by colour alone." A red wallet tile is a
 * red surface to a sighted user; to a screen reader it must still *say* it is over budget. These
 * helpers assemble those labels in one place so the wording stays consistent.
 */

export type WalletStatus = 'normal' | 'overBudget' | 'prioritySavings';

const STATUS_PHRASE: Record<WalletStatus, string | null> = {
  normal: null,
  overBudget: 'over budget',
  prioritySavings: 'priority savings goal',
};

export function walletAccessibilityLabel(input: {
  name: string;
  category?: string;
  amount: number;
  status: WalletStatus;
  meta?: string;
  currency?: FormatMoneyOptions;
}): string {
  const parts: string[] = [input.name];
  if (input.category) parts.push(input.category);
  parts.push(moneyAccessibilityLabel(input.amount, input.currency));
  if (input.meta) parts.push(input.meta);
  const status = STATUS_PHRASE[input.status];
  if (status) parts.push(status);
  return parts.join(', ');
}

export function statAccessibilityLabel(label: string, percent: number): string {
  // The word is always "remaining", never "used" (Brand Guide 02).
  const base = `${label}, ${formatPercent(percent)} remaining`;
  return percent <= 0 ? `${base}, nothing left` : base;
}

export function progressAccessibilityValue(percent: number): {
  now: number;
  min: number;
  max: number;
} {
  return { now: Math.max(0, Math.min(100, Math.round(percent))), min: 0, max: 100 };
}
