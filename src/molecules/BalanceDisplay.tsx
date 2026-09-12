import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { type FormatMoneyOptions } from '../utils/formatting';
import { BaconMoneyDisplay, type BaconMoneyVariant } from '../atoms/BaconMoneyDisplay';
import { EyeToggle } from '../atoms/EyeToggle';

/**
 * A balance with its privacy control.
 *
 * BRAND GUIDE REQUIREMENT (11): "The eye beside every balance masks the figure in place. It sits
 * next to the number, on the screen, at all times — it is not buried in Settings, and it is not a
 * one-off."
 *
 * Pairing the two in one component is how "always" gets enforced: a screen that shows a balance
 * reaches for this, and gets the toggle whether or not it remembered to.
 */
export interface BalanceDisplayProps {
  amount: number;
  hidden: boolean;
  onToggleHidden: (nextHidden: boolean) => void;
  change?: number;
  variant?: BaconMoneyVariant;
  currency?: FormatMoneyOptions;
  testID?: string;
}

export function BalanceDisplay({
  amount,
  hidden,
  onToggleHidden,
  change,
  variant = 'hero',
  currency,
  testID,
}: BalanceDisplayProps): React.JSX.Element {
  return (
    <View style={styles.row} testID={testID}>
      <BaconMoneyDisplay
        amount={amount}
        change={change}
        variant={variant}
        masked={hidden}
        currency={currency}
        align="center"
      />
      <EyeToggle hidden={hidden} onToggle={onToggleHidden} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: baconSpacing.md,
  },
});
