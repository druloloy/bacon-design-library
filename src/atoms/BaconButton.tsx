import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { baconColors } from '../foundations/colors';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { BaconSurfaceProvider, useBaconSurface, type BaconSurface } from '../theme';
import { BaconText } from './BaconText';

/**
 * The Bacon button.
 *
 * BRAND GUIDE REQUIREMENT (08): "Everything the user can press is a full pill. There are no
 * rectangular buttons, no icon buttons with labels, and no more than two buttons in a row."
 *
 * BRAND GUIDE REQUIREMENT (04 — The red doctrine): "A filled red button does not exist in this
 * system." There is consequently no `danger` or `destructive` variant here, and no way to add
 * one without editing this file. Destruction is `<DestructiveAction>`, which is bare text.
 *
 * There are only two variants because the button's *appearance* is decided by the ground it
 * stands on, not by the caller. The same `<BaconButton>` is a navy fill on Paper, an outline-white
 * pill on a Navy screen, and a Navy 600 fill inside a Navy 700 panel — exactly as the guide
 * documents — without any screen having to know the rule.
 */
export const BACON_BUTTON_VARIANTS = ['primary', 'secondary'] as const;
export type BaconButtonVariant = (typeof BACON_BUTTON_VARIANTS)[number];

export interface BaconButtonProps {
  children: string;
  onPress: () => void;
  variant?: BaconButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Split a row of two buttons evenly (Brand Guide 08: "two per row maximum, split evenly"). */
  fill?: boolean;
  accessibilityHint?: string;
  testID?: string;
}

/** The 1.5pt navy hairline the guide specifies for a secondary pill. */
const HAIRLINE = 1.5;

interface Appearance {
  background: string;
  border: string | null;
  /** The surface the *label* sits on, so BaconText resolves a legal colour for it. */
  labelSurface: BaconSurface;
}

export function BaconButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fill = false,
  accessibilityHint,
  testID,
}: BaconButtonProps): React.JSX.Element {
  const surface = useBaconSurface();
  const inactive = disabled || loading;

  const appearance = useMemo<Appearance>(() => {
    // Inside a Navy 700 panel, a control is Navy 600 (Brand Guide 03).
    if (surface.surface === 'panel') {
      return variant === 'primary'
        ? { background: baconColors.navy600, border: null, labelSurface: 'navy' }
        : { background: 'transparent', border: baconColors.white, labelSurface: 'panel' };
    }
    // On a navy ground, outline-white *is* the button. A filled white pill is reserved for a
    // selected chip and must never be a call to action (Brand Guide 08).
    if (surface.onColor) {
      return { background: 'transparent', border: baconColors.white, labelSurface: 'navy' };
    }
    return variant === 'primary'
      ? { background: baconColors.navy900, border: null, labelSurface: 'navy' }
      : { background: 'transparent', border: baconColors.navy900, labelSurface: 'paper' };
  }, [surface.surface, surface.onColor, variant]);

  const surfaceStyle = useMemo<ViewStyle>(
    () => ({
      height: baconLayout.buttonHeight,
      paddingHorizontal: baconLayout.buttonPaddingHorizontal,
      borderRadius: baconRadii.pill,
      backgroundColor: appearance.background,
      borderWidth: appearance.border ? HAIRLINE : 0,
      borderColor: appearance.border ?? 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: baconSpacing.sm,
      opacity: inactive ? 0.4 : 1,
      ...(fill ? { flex: 1 } : null),
    }),
    [appearance, inactive, fill],
  );

  const spinnerColor =
    appearance.labelSurface === 'paper' ? baconColors.navy900 : baconColors.white;

  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, busy: loading }}
      style={({ pressed }) => [
        fill ? styles.fill : styles.press,
        pressed && !inactive ? styles.pressed : null,
      ]}
      testID={testID}
    >
      <View style={surfaceStyle} testID="bacon-button-surface">
        {loading ? (
          <ActivityIndicator
            size="small"
            color={spinnerColor}
            testID="bacon-button-spinner"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        ) : null}
        <BaconSurfaceProvider surface={appearance.labelSurface}>
          <BaconText
            variant="buttonLabel"
            align="center"
            importantForAccessibility="no"
            numberOfLines={1}
            style={styles.label}
          >
            {children}
          </BaconText>
        </BaconSurfaceProvider>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'flex-start' },
  fill: { flex: 1, alignSelf: 'auto' },
  pressed: { opacity: 0.8 },
  label: { flexShrink: 1 },
});
