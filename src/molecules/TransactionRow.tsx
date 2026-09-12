import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { formatAttribution, type FormatMoneyOptions } from '../utils/formatting';
import { BaconText } from '../atoms/BaconText';
import { BaconMoneyDisplay } from '../atoms/BaconMoneyDisplay';

/**
 * One line in a transaction list.
 *
 * BRAND GUIDE REQUIREMENT (06 — Alignment): "Row links and transaction lines are left-aligned.
 * Nothing is right-aligned except the arrow on a row link and the date on a transaction."
 *
 * BRAND GUIDE REQUIREMENT (02 — Attribution): "Transactions credit a person by handle —
 * *Updated by @ddruu1* — because wallets are shared with partners."
 */
export interface TransactionRowProps {
  title: string;
  amount: number;
  /** The partner handle, with or without the @. */
  handle?: string;
  /** Rendered right-aligned, the one exception the guide allows alongside the row-link arrow. */
  date?: string;
  currency?: FormatMoneyOptions;
  testID?: string;
}

export function TransactionRow({
  title,
  amount,
  handle,
  date,
  currency,
  testID,
}: TransactionRowProps): React.JSX.Element {
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.lead}>
        <BaconText variant="label" align="left" numberOfLines={1}>
          {title}
        </BaconText>
        {handle ? (
          <BaconText variant="meta" align="left">
            {formatAttribution(handle)}
          </BaconText>
        ) : null}
      </View>

      <View style={styles.trail}>
        <BaconMoneyDisplay amount={amount} variant="inline" align="right" currency={currency} />
        {date ? (
          <BaconText variant="meta" align="right">
            {date}
          </BaconText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: baconSpacing.md,
    paddingVertical: baconSpacing.md,
  },
  lead: { flexShrink: 1, gap: baconSpacing.xs },
  trail: { alignItems: 'flex-end', gap: baconSpacing.xs },
});
