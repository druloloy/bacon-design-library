import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import {
  formatMoney,
  formatChange,
  maskMoney,
  moneyAccessibilityLabel,
  type FormatMoneyOptions,
} from '../utils/formatting';
import { BaconText } from './BaconText';
import type { BaconTextVariant } from '../foundations/typography';

/**
 * Every amount in Bacon is rendered here.
 *
 * BRAND GUIDE REQUIREMENT (01): "Money is the headline. The balance is the largest element on any
 * screen that has one." Centralising the rendering is what makes the guide's number rules
 * unbreakable — the hard space, the comma grouping, the trailing change in Regular weight, and
 * above all the minus sign that a negative balance must keep even though the surface has already
 * turned red (Brand Guide 12).
 */
export const BACON_MONEY_VARIANTS = ['hero', 'tile', 'inline'] as const;
export type BaconMoneyVariant = (typeof BACON_MONEY_VARIANTS)[number];

/** Each money size reuses a documented role from the type scale; none introduces a new size. */
const VARIANT_ROLE: Record<BaconMoneyVariant, BaconTextVariant> = {
  hero: 'heroMoney',
  tile: 'sectionHeading',
  inline: 'cardTitle',
};

export interface BaconMoneyDisplayProps {
  amount: number;
  /** A change that trails the amount: `₱ 2,000 +50`. */
  change?: number;
  variant?: BaconMoneyVariant;
  /** Hide the figure in place. Driven by EyeToggle. */
  masked?: boolean;
  currency?: FormatMoneyOptions;
  align?: 'left' | 'center' | 'right';
  /** Drop the currency glyph — for contexts that already imply it. */
  showSymbol?: boolean;
  testID?: string;
}

export function BaconMoneyDisplay({
  amount,
  change,
  variant = 'tile',
  masked = false,
  currency,
  align = 'center',
  showSymbol = true,
  testID,
}: BaconMoneyDisplayProps): React.JSX.Element {
  const options = useMemo<FormatMoneyOptions>(
    () => ({ ...currency, showSymbol }),
    [currency, showSymbol],
  );

  const text = masked ? maskMoney(amount, options) : formatMoney(amount, options);

  /**
   * BRAND GUIDE REQUIREMENT (11 — Privacy): the eye "masks the figure in place". A masked balance
   * must not leak through the accessibility tree either, so the label is replaced, not decorated.
   */
  const label = masked
    ? 'Balance hidden'
    : [
        moneyAccessibilityLabel(amount, currency),
        change === undefined || change === 0
          ? null
          : `${change > 0 ? 'up' : 'down'} ${Math.abs(change)}`,
      ]
        .filter(Boolean)
        .join(', ');

  return (
    <View
      style={[
        styles.row,
        align === 'center' && styles.centered,
        align === 'right' && styles.right,
      ]}
      accessible
      accessibilityLabel={label}
      testID={testID}
    >
      <BaconText variant={VARIANT_ROLE[variant]} align={align} importantForAccessibility="no">
        {text}
      </BaconText>
      {change !== undefined && !masked ? (
        // Regular weight so the amount stays dominant (Brand Guide 02).
        <BaconText variant="body" align={align} importantForAccessibility="no">
          {formatChange(change, currency)}
        </BaconText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: baconSpacing.sm,
    flexWrap: 'wrap',
  },
  centered: { justifyContent: 'center' },
  right: { justifyContent: 'flex-end' },
});
