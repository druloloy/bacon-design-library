import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { baconLayout } from '../foundations/layout';
import { baconSpacing } from '../foundations/spacing';
import { BaconText } from './BaconText';

/**
 * A destructive action.
 *
 * BRAND GUIDE REQUIREMENT (04 — The red doctrine): "Destructive red is always bare text — never a
 * button, never an icon. A filled red button does not exist in this system."
 *
 * BRAND GUIDE REQUIREMENT (11): "Destructive actions appear last in a bottom sheet, as red bold
 * text, phrased in the first person: *I want to delete this budget.* No red button, no trash icon,
 * no inline delete on a card."
 *
 * The component therefore has no `variant`, no icon slot and no surface of its own. It is the only
 * red text in the library, and `BaconButton` has no way to become red — which is what keeps the
 * two meanings of Signal Red separated by form.
 *
 * BRAND GUIDE REQUIREMENT (12): destructive actions should "have a confirmation step of their
 * own". Pass `confirmLabel` and the first press arms the action rather than performing it. The
 * copy stays with the application, because the confirmation wording is product language.
 */
export interface DestructiveActionProps {
  children: string;
  onPress: () => void;
  /**
   * When given, the first press replaces the label with this one and only the second press fires
   * `onPress`. Phrase it in the first person, as the guide phrases the action itself.
   */
  confirmLabel?: string;
  disabled?: boolean;
  testID?: string;
}

export function DestructiveAction({
  children,
  onPress,
  confirmLabel,
  disabled = false,
  testID,
}: DestructiveActionProps): React.JSX.Element {
  const [armed, setArmed] = useState(false);
  const label = armed && confirmLabel ? confirmLabel : children;

  const handlePress = useCallback(() => {
    if (confirmLabel && !armed) {
      setArmed(true);
      return;
    }
    onPress();
  }, [confirmLabel, armed, onPress]);

  return (
    <Pressable
      onPress={disabled ? undefined : handlePress}
      disabled={disabled}
      // It is a button by role even though it is bare text, so it is identifiable by form and not
      // by colour alone (Brand Guide 12).
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={
        confirmLabel && !armed ? 'Asks you to confirm before anything is deleted' : undefined
      }
      accessibilityState={{ disabled }}
      style={styles.press}
      testID={testID}
    >
      <View style={styles.surface} testID="bacon-destructive-surface">
        <BaconText
          variant="buttonLabel"
          tone="destructive"
          align="center"
          importantForAccessibility="no"
        >
          {label}
        </BaconText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'stretch' },
  /**
   * No background, no border, no radius — the surface exists only to guarantee the 48pt tap
   * target the guide requires. Anything more would make this a button.
   */
  surface: {
    minHeight: baconLayout.minTapTarget,
    paddingHorizontal: baconSpacing.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
