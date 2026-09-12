import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { BaconChip } from '../atoms/BaconChip';

/**
 * A single-choice group of chips.
 *
 * BRAND GUIDE REQUIREMENT (08): "They wrap into **ragged centred rows**, not a rigid grid — that
 * irregularity is part of the look."
 *
 * BRAND GUIDE REQUIREMENT (12): "Chips announced as a radio group, not a list of buttons."
 *
 * The layout is `flexWrap` with centred justification precisely so rows come out ragged. There is
 * no `columns` prop: converting this to a grid is a documented misuse.
 */
export interface ChipOption {
  id: string;
  label: string;
  /** The category emoji, where the option is a category. */
  emoji?: string;
  disabled?: boolean;
}

export interface ChipGroupProps {
  /** Names the group for assistive technology — usually the question being answered. */
  label: string;
  options: readonly ChipOption[];
  value: string | null;
  onChange: (id: string) => void;
  testID?: string;
}

export function ChipGroup({
  label,
  options,
  value,
  onChange,
  testID = 'bacon-chip-group',
}: ChipGroupProps): React.JSX.Element {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={styles.group}
      testID={testID}
    >
      {options.map((option) => (
        <BaconChip
          key={option.id}
          label={option.label}
          emoji={option.emoji}
          selected={value === option.id}
          disabled={option.disabled}
          onPress={() => onChange(option.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: baconSpacing.md,
  },
});
