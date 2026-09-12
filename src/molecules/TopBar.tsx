import { Pressable, StyleSheet, View } from 'react-native';
import { baconLayout } from '../foundations/layout';
import { baconSpacing } from '../foundations/spacing';
import { BaconArrow } from '../atoms/BaconArrow';
import { BaconText } from '../atoms/BaconText';
import { useBaconSurface } from '../theme';

/**
 * The Bacon top bar.
 *
 * BRAND GUIDE REQUIREMENT (08): "The bar holds navigation only — never a title. Forward motion is
 * a Bold uppercase word plus a long arrow, in the top right. The last step of any flow says
 * FINISH; a dismissable screen says CLOSE ×."
 *
 * BRAND GUIDE REQUIREMENT (11): "Advance from the top. Forward motion lives in the top-right of
 * the bar, not in a button at the bottom of the content."
 *
 * There is deliberately no `title` prop. A title in the top bar is one of the misuses the guide
 * names (13), and the cheapest way to stop it is to make it unrepresentable.
 */

/**
 * The complete forward vocabulary.
 *
 * BRAND GUIDE REQUIREMENT (02): the word is FINISH, never Submit / Save / Confirm. Intermediate
 * steps say NEXT. A dismissable screen uses `onClose`, which renders CLOSE.
 */
export type BaconForwardLabel = 'NEXT' | 'FINISH';

export interface BaconForwardAction {
  label: BaconForwardLabel;
  onPress: () => void;
  disabled?: boolean;
}

export interface TopBarProps {
  /** The back control. Always the left arrow, never a word (Brand Guide 11). */
  onBack?: () => void;
  /** The top-right advance. Mutually exclusive with `onClose` in practice. */
  forwardAction?: BaconForwardAction;
  /** Renders CLOSE × instead of a back arrow, for a screen that is dismissed rather than left. */
  onClose?: () => void;
  testID?: string;
}

export function TopBar({
  onBack,
  forwardAction,
  onClose,
  testID = 'bacon-top-bar',
}: TopBarProps): React.JSX.Element {
  return (
    <View style={styles.bar} testID={testID}>
      <View style={styles.side}>
        {onClose ? null : onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.control}
            testID="bacon-top-bar-back"
          >
            <BaconArrow direction="left" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.sideEnd}>
        {onClose ? (
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="CLOSE"
            style={styles.control}
            testID="bacon-top-bar-close"
          >
            <BaconText variant="navAction" importantForAccessibility="no">
              CLOSE
            </BaconText>
            <CloseGlyph />
          </Pressable>
        ) : null}

        {forwardAction ? (
          <Pressable
            onPress={forwardAction.disabled ? undefined : forwardAction.onPress}
            disabled={forwardAction.disabled}
            accessibilityRole="button"
            accessibilityLabel={forwardAction.label}
            accessibilityState={{ disabled: Boolean(forwardAction.disabled) }}
            style={styles.control}
            testID="bacon-top-bar-forward"
          >
            <BaconText variant="navAction" importantForAccessibility="no">
              {forwardAction.label}
            </BaconText>
            <BaconArrow direction="right" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/** The × beside CLOSE, drawn from two crossed bars for the same reason BaconArrow is. */
function CloseGlyph(): React.JSX.Element {
  const surface = useBaconSurface();
  return (
    <View
      style={styles.closeGlyph}
      accessibilityElementsHidden
      importantForAccessibility="no"
      testID="bacon-top-bar-close-glyph"
    >
      <View
        style={[styles.closeBar, styles.closeBarForward, { backgroundColor: surface.text }]}
      />
      <View style={[styles.closeBar, styles.closeBarBack, { backgroundColor: surface.text }]} />
    </View>
  );
}

const CONTROL_PADDING = baconSpacing.xs;

const styles = StyleSheet.create({
  bar: {
    height: baconLayout.topBarHeight,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { flexDirection: 'row', alignItems: 'center' },
  sideEnd: { flexDirection: 'row', alignItems: 'center', gap: baconSpacing.md },
  control: {
    minWidth: baconLayout.minTapTarget,
    minHeight: baconLayout.minTapTarget,
    paddingHorizontal: CONTROL_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: baconSpacing.sm,
  },
  closeGlyph: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  closeBar: { position: 'absolute', width: 16, height: 2, borderRadius: 2 },
  closeBarForward: { transform: [{ rotate: '45deg' }] },
  closeBarBack: { transform: [{ rotate: '-45deg' }] },
});
