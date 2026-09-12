import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { formatMoney, type FormatMoneyOptions } from '../utils/formatting';
import { ChipGroup, type ChipOption } from './ChipGroup';
import { QuestionInput } from './QuestionInput';

/**
 * A numeric field with quick-amount chips beneath it.
 *
 * BRAND GUIDE REQUIREMENT (11): "Type or tap, always both. Any numeric field carries quick-amount
 * chips beneath it that fill the field. The field stays editable afterwards. Never make the chips
 * the only way in, and never make typing the only way in."
 *
 * The component enforces both halves: there is no `chipsOnly` or `readOnly` option, and tapping a
 * chip writes into the same value the field edits.
 */
export interface QuickAmountInputProps {
  /** The question, in the second person: "How much will be your budget?" */
  question: string;
  /** `null` means the field is empty — distinct from a deliberate zero. */
  value: number | null;
  onChangeValue: (value: number | null) => void;
  /** The quick amounts. Rendered with the currency glyph, e.g. `₱ 500`. */
  options: readonly number[];
  currency?: FormatMoneyOptions;
  autoFocus?: boolean;
  testID?: string;
}

/** Strips grouping separators so a typed "20,000" still parses. */
function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function QuickAmountInput({
  question,
  value,
  onChangeValue,
  options,
  currency,
  autoFocus,
  testID,
}: QuickAmountInputProps): React.JSX.Element {
  const chipOptions = useMemo<ChipOption[]>(
    () =>
      options.map((amount) => ({
        id: String(amount),
        label: formatMoney(amount, currency),
      })),
    [options, currency],
  );

  const handleChangeText = useCallback(
    (text: string) => onChangeValue(parseAmount(text)),
    [onChangeValue],
  );

  const handleChip = useCallback((id: string) => onChangeValue(Number(id)), [onChangeValue]);

  // The field shows the raw number while editing, so the caret does not fight comma grouping.
  const displayValue = value === null ? '' : String(value);

  return (
    <QuestionInput
      question={question}
      value={displayValue}
      onChangeText={handleChangeText}
      keyboardType="numeric"
      autoFocus={autoFocus}
      testID={testID}
    >
      <View style={styles.chips}>
        <ChipGroup
          // A distinct label: the field already carries the question, and two elements sharing
          // one label makes the field unaddressable to a screen reader.
          label="Quick amounts"
          options={chipOptions}
          // A chip reads as selected only when the value still matches it exactly; typing over it
          // deselects, because the field is the source of truth.
          value={value === null ? null : String(value)}
          onChange={handleChip}
          testID="bacon-quick-amount-chips"
        />
      </View>
    </QuestionInput>
  );
}

const styles = StyleSheet.create({
  chips: { marginTop: baconSpacing.screen },
});
