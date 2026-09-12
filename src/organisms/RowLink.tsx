import { useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { baconCardShadow, baconFlat } from '../foundations/elevation';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { BaconArrow } from '../atoms/BaconArrow';
import { BaconText } from '../atoms/BaconText';
import {
  BaconSurfaceProvider,
  useBaconSurface,
  useBaconTheme,
  type BaconSurface,
} from '../theme';

/**
 * The "go somewhere" affordance.
 *
 * BRAND GUIDE REQUIREMENT (09): "88pt tall. Bold title, regular subtitle with the count in bold,
 * long arrow right. Used on the dashboard, on completion screens, and anywhere a screen hands off
 * to another."
 *
 * BRAND GUIDE REQUIREMENT (06): the row is left-aligned, and the arrow is one of only two things
 * in the product that may be right-aligned.
 */
export interface RowLinkProps {
  title: string;
  /**
   * The subtitle, with `{}` marking where `emphasis` goes:
   * `subtitle="You have {} active wallets"` with `emphasis={4}`.
   *
   * Brand Guide 06 — "Bold is used surgically inside running text to carry the number."
   */
  subtitle?: string;
  emphasis?: string | number;
  onPress: () => void;
  testID?: string;
}

export function RowLink({
  title,
  subtitle,
  emphasis,
  onPress,
  testID = 'bacon-row-link',
}: RowLinkProps): React.JSX.Element {
  const theme = useBaconTheme();
  const parentSurface = useBaconSurface();

  /**
   * On paper the row is a white card carrying the one shadow. On a navy ground it is a Navy 700
   * panel and flat — "panels on navy carry no shadow at all; separation comes from the tint step"
   * (Brand Guide 04).
   */
  const rowSurface: BaconSurface = parentSurface.onColor ? 'panel' : 'white';

  const rowStyle = useMemo<ViewStyle>(
    () => ({
      minHeight: baconLayout.rowLinkHeight,
      borderRadius: baconRadii.card,
      paddingHorizontal: baconSpacing.screen,
      paddingVertical: baconSpacing.screen,
      backgroundColor: theme.surfaces[rowSurface].background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: baconSpacing.md,
      ...(rowSurface === 'white' ? baconCardShadow : baconFlat),
    }),
    [theme, rowSurface],
  );

  const hasEmphasis = Boolean(subtitle) && emphasis !== undefined;
  const [before = '', after = ''] = hasEmphasis
    ? (subtitle as string).split('{}')
    : [subtitle ?? '', ''];

  return (
    <Pressable
      onPress={onPress}
      // A link, not a button: it hands the user to another screen rather than acting here.
      accessibilityRole="link"
      accessibilityLabel={title}
      accessibilityHint={hasEmphasis ? `${before}${String(emphasis)}${after}` : subtitle}
      style={({ pressed }) => (pressed ? styles.pressed : null)}
    >
      <BaconSurfaceProvider surface={rowSurface}>
        <View style={rowStyle} testID={testID}>
          <View style={styles.lead}>
            <BaconText
              variant="cardTitle"
              align="left"
              numberOfLines={1}
              importantForAccessibility="no"
            >
              {title}
            </BaconText>
            {subtitle ? (
              <BaconText variant="body" align="left" importantForAccessibility="no">
                {before}
                {hasEmphasis ? (
                  <BaconText variant="buttonLabel" align="left">
                    {String(emphasis)}
                  </BaconText>
                ) : null}
                {after}
              </BaconText>
            ) : null}
          </View>

          <BaconArrow direction="right" testID="bacon-row-link-arrow" />
        </View>
      </BaconSurfaceProvider>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lead: { flexShrink: 1, gap: baconSpacing.xs },
  pressed: { opacity: 0.9 },
});
