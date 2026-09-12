import { useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { baconColors } from '../foundations/colors';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { chipHitSlop } from '../foundations/accessibility';
import { BaconSurfaceProvider, useBaconSurface, type BaconSurface } from '../theme';
import { BaconText } from './BaconText';

/**
 * A selection chip.
 *
 * BRAND GUIDE REQUIREMENT (08): "36pt tall, Regular weight, hairline border, emoji prefix where
 * the option is a category… Selected inverts to a solid fill."
 *
 * BRAND GUIDE REQUIREMENT (12): "Chips announced as a radio group, not a list of buttons" and
 * "48pt minimum targets — current chips are 36pt tall and need padding, not resizing." The chip
 * therefore keeps its 36pt visual height and grows its *hit area* to 48pt with hitSlop.
 */
export interface BaconChipProps {
  label: string;
  onPress: () => void;
  /** The category emoji. Decorative — the screen reader hears `label`, not the emoji. */
  emoji?: string;
  selected?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  testID?: string;
}

/** The hairline the guide draws around an unselected chip. */
const HAIRLINE = 1.5;

interface ChipAppearance {
  background: string;
  border: string;
  labelSurface: BaconSurface;
}

export function BaconChip({
  label,
  onPress,
  emoji,
  selected = false,
  disabled = false,
  accessibilityHint,
  testID,
}: BaconChipProps): React.JSX.Element {
  const surface = useBaconSurface();

  const appearance = useMemo<ChipAppearance>(() => {
    if (surface.onColor) {
      // On navy, the selected chip is the filled white pill — the one place that treatment is
      // legal (Brand Guide 08).
      return selected
        ? { background: baconColors.white, border: baconColors.white, labelSurface: 'white' }
        : { background: 'transparent', border: baconColors.white, labelSurface: 'navy' };
    }
    return selected
      ? { background: baconColors.navy900, border: baconColors.navy900, labelSurface: 'navy' }
      : { background: 'transparent', border: baconColors.navy900, labelSurface: 'paper' };
  }, [surface.onColor, selected]);

  const surfaceStyle = useMemo<ViewStyle>(
    () => ({
      height: baconLayout.chipVisualHeight,
      paddingHorizontal: baconSpacing.screen,
      borderRadius: baconRadii.pill,
      borderWidth: HAIRLINE,
      borderColor: appearance.border,
      backgroundColor: appearance.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: baconSpacing.sm,
      opacity: disabled ? 0.4 : 1,
    }),
    [appearance, disabled],
  );

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      // A radio, not a button, so a group of chips is heard as one choice (Brand Guide 12).
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected, disabled }}
      hitSlop={chipHitSlop}
      style={({ pressed }) => (pressed && !disabled ? styles.pressed : null)}
      testID={testID}
    >
      <View style={surfaceStyle} testID="bacon-chip-surface">
        <BaconSurfaceProvider surface={appearance.labelSurface}>
          {emoji ? (
            <BaconText
              variant="body"
              align="center"
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {emoji}
            </BaconText>
          ) : null}
          <BaconText
            variant="body"
            align="center"
            importantForAccessibility="no"
            numberOfLines={1}
          >
            {label}
          </BaconText>
        </BaconSurfaceProvider>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
});
