import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { baconLayout } from '../foundations/layout';
import { BaconSurfaceProvider, useBaconTheme, type BaconSurface } from '../theme';
import { useSafeAreaInsets } from '../utils/safeArea';

/**
 * The Bacon screen ground.
 *
 * BRAND GUIDE REQUIREMENT (04): "A screen's background colour is not a styling choice — it tells
 * the user what kind of screen they are on. If the screen changes the user's money, it is light.
 * If it changes the app or the account, it is navy. Nothing in between, and never both on one
 * screen."
 *
 * There is therefore no `backgroundColor` prop and no third variant. This is deliberately *not*
 * a light/dark theme: both variants exist at once in the same app, and which one a screen gets
 * is a product decision, not a user preference.
 */
export const BACON_SCREEN_VARIANTS = ['money', 'system'] as const;
export type BaconScreenVariant = (typeof BACON_SCREEN_VARIANTS)[number];

const VARIANT_SURFACE: Record<BaconScreenVariant, BaconSurface> = {
  money: 'paper',
  system: 'navy',
};

export interface BaconScreenProps {
  /** `money` → Paper. `system` → Navy. */
  variant: BaconScreenVariant;
  children: React.ReactNode;
  /**
   * Make the body scrollable. Off by default: a Bacon screen is meant to fit, and the empty
   * lower third is the design (Brand Guide 07).
   */
  scroll?: boolean;
  /**
   * Remove the 20pt gutter so a child can bleed to the screen edge — the hero does this.
   * The gutter is still applied by the hero's own content.
   */
  edgeToEdge?: boolean;
  /** Content rendered outside the gutter and pinned to the bottom edge, e.g. the FAB. */
  footer?: React.ReactNode;
  testID?: string;
}

export function BaconScreen({
  variant,
  children,
  scroll = false,
  edgeToEdge = false,
  footer,
  testID = 'bacon-screen',
}: BaconScreenProps): React.JSX.Element {
  const theme = useBaconTheme();
  const surface = VARIANT_SURFACE[variant];
  const insets = useSafeAreaInsets();

  const rootStyle = useMemo<ViewStyle>(
    () => ({
      flex: 1,
      backgroundColor: theme.surfaces[surface].background,
      paddingTop: insets.top,
    }),
    [theme, surface, insets.top],
  );

  const contentStyle = useMemo<ViewStyle>(
    () => ({
      flex: 1,
      width: '100%',
      // Fluid to 480pt, then centred — the gutter and grid gaps stay at their documented values
      // rather than every measurement being scaled up (Brand Guide 07).
      maxWidth: baconLayout.maxContentWidth,
      alignSelf: 'center',
      paddingHorizontal: edgeToEdge ? 0 : baconLayout.gutter,
    }),
    [edgeToEdge],
  );

  const body = scroll ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      testID="bacon-screen-scroll"
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <BaconSurfaceProvider surface={surface}>
      <View style={rootStyle} testID={testID}>
        <View style={contentStyle} testID="bacon-screen-content">
          {body}
        </View>
        {footer ? (
          <View
            style={[styles.footer, { paddingBottom: insets.bottom }]}
            testID="bacon-screen-footer"
            pointerEvents="box-none"
          >
            {footer}
          </View>
        ) : null}
      </View>
    </BaconSurfaceProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  footer: { alignItems: 'center', justifyContent: 'flex-end' },
});
