import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { baconLayout } from '../foundations/layout';
import { useBaconSurface } from '../theme';

/**
 * The balance-masking control.
 *
 * BRAND GUIDE REQUIREMENT (11): "Privacy is a control, not a setting. The eye beside every balance
 * masks the figure in place. It sits next to the number, on the screen, at all times — it is not
 * buried in Settings, and it is not a one-off."
 *
 * BRAND GUIDE REQUIREMENT (12): "Real labels on the eye toggle, the FAB, and every chip."
 *
 * ENGINEERING DECISION: the glyph is drawn from Views (a lens, a pupil, and a slash) for the same
 * reason BaconArrow is — no native SVG dependency for two pieces of chrome.
 */
export interface EyeToggleProps {
  /** True when the balance is currently masked. */
  hidden: boolean;
  /** Receives the state the control is moving *to*, so callers never have to invert it. */
  onToggle: (nextHidden: boolean) => void;
  /** Glyph size. The tap target stays at 48pt regardless. */
  size?: number;
  testID?: string;
}

const DEFAULT_GLYPH = 24;

export function EyeToggle({
  hidden,
  onToggle,
  size = DEFAULT_GLYPH,
  testID,
}: EyeToggleProps): React.JSX.Element {
  const surface = useBaconSurface();
  const stroke = surface.text;
  const handlePress = useCallback(() => onToggle(!hidden), [onToggle, hidden]);

  const lens = useMemo<ViewStyle>(
    () => ({
      width: size,
      height: size * 0.62,
      borderWidth: 2,
      borderColor: stroke,
      // A tall radius on a wide box gives the almond lens shape.
      borderRadius: size * 0.45,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    [size, stroke],
  );

  const pupil = useMemo<ViewStyle>(
    () => ({
      width: size * 0.26,
      height: size * 0.26,
      borderRadius: size * 0.13,
      backgroundColor: stroke,
    }),
    [size, stroke],
  );

  const slash = useMemo<ViewStyle>(
    () => ({
      position: 'absolute',
      width: size * 1.15,
      height: 2,
      borderRadius: 2,
      backgroundColor: stroke,
      transform: [{ rotate: '-45deg' }],
    }),
    [size, stroke],
  );

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="switch"
      // The label names the *action*, and flips with the state, so a screen reader user always
      // hears what the next press will do.
      accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}
      accessibilityState={{ checked: hidden }}
      style={styles.target}
      testID={testID}
    >
      <View style={lens} testID="bacon-eye-lens">
        <View style={pupil} testID="bacon-eye-pupil" />
      </View>
      {hidden ? <View style={slash} testID="bacon-eye-slash" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    minWidth: baconLayout.minTapTarget,
    minHeight: baconLayout.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
