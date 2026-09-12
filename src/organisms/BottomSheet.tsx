import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { baconLayout } from '../foundations/layout';
import { BaconButton } from '../atoms/BaconButton';
import { BaconText } from '../atoms/BaconText';
import { BaconSurfaceProvider, useBaconTheme } from '../theme';
import { useSafeAreaInsets } from '../utils/safeArea';

/**
 * The one overlay in the product.
 *
 * BRAND GUIDE REQUIREMENT (09): "Top corners 24pt. The page behind stays visible and
 * **undimmed**. Order is fixed: navy pill, plain text links, destructive red text last."
 *
 * The undimmed backdrop is the detail most likely to be "fixed" by someone reaching for a
 * Material bottom sheet, so it is not configurable: there is no `dim`, `backdropOpacity` or
 * `scrim` prop, and the backdrop is painted transparent rather than left to a default.
 *
 * Order is the caller's responsibility because the actions are the caller's — but the three
 * action components below are shaped so that the right order is the natural one to write.
 */
export interface BottomSheetProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  /** Names the sheet for assistive technology, e.g. the wallet it acts on. */
  accessibilityLabel?: string;
  testID?: string;
}

export function BottomSheet({
  visible,
  onRequestClose,
  children,
  accessibilityLabel = 'Actions',
  testID = 'bacon-bottom-sheet',
}: BottomSheetProps): React.JSX.Element | null {
  const theme = useBaconTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* Transparent, not dimmed: the list stays visible behind the sheet (Brand Guide 09). */}
        <Pressable
          style={styles.backdrop}
          onPress={onRequestClose}
          accessibilityRole="button"
          accessibilityLabel="Close actions"
          testID="bacon-bottom-sheet-backdrop"
        />
        <BaconSurfaceProvider surface="white">
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.surfaces.white.background,
                paddingBottom: baconSpacing.screen + insets.bottom,
              },
            ]}
            accessibilityViewIsModal
            accessibilityLabel={accessibilityLabel}
            testID={testID}
          >
            {children}
          </View>
        </BaconSurfaceProvider>
      </View>
    </Modal>
  );
}

/**
 * The first action in a sheet: a navy pill.
 *
 * Brand Guide 09 — "Order is fixed: navy pill, plain text links, destructive red text last."
 * There is at most one of these per sheet.
 */
export interface SheetActionProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export function SheetPrimaryAction({
  children,
  onPress,
  disabled,
  testID,
}: SheetActionProps): React.JSX.Element {
  return (
    <View style={styles.primary}>
      <BaconButton onPress={onPress} disabled={disabled} fill testID={testID}>
        {children}
      </BaconButton>
    </View>
  );
}

/** A plain text link in the sheet. Bold, never a button surface. */
export function SheetAction({
  children,
  onPress,
  disabled,
  testID,
}: SheetActionProps): React.JSX.Element {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={({ pressed }) => (pressed && !disabled ? styles.pressed : null)}
      testID={testID}
    >
      <View style={styles.action} testID="bacon-sheet-action-surface">
        <BaconText variant="buttonLabel" align="center" importantForAccessibility="no">
          {children}
        </BaconText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  sheet: {
    borderTopLeftRadius: baconRadii.hero,
    borderTopRightRadius: baconRadii.hero,
    paddingHorizontal: baconSpacing.screen,
    paddingTop: baconSpacing.screen,
    gap: baconSpacing.md,
    width: '100%',
    maxWidth: baconLayout.maxContentWidth,
    alignSelf: 'center',
  },
  primary: { flexDirection: 'row', marginBottom: baconSpacing.sm },
  /** No background, no border — the 48pt target is the only thing this surface provides. */
  action: {
    minHeight: baconLayout.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
});
