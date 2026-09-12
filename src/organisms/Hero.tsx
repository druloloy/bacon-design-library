import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { BaconSurfaceProvider, useBaconTheme, type BaconSurface } from '../theme';

/**
 * The hero at the top of a feed screen.
 *
 * BRAND GUIDE REQUIREMENT (07): "Hero height ≈ 250pt, content in the top 100pt." The content is
 * anchored to the top and the rest is left alone — "the emptiness is not an unfinished layout; it
 * is the calm the brand is selling."
 *
 * BRAND GUIDE REQUIREMENT (10): archetype 1 is a paper hero; archetype 1b is the same structure
 * with a navy hero, "used when the screen is about one wallet type rather than everything". The
 * navy hero carries the 24pt bottom corners.
 */
export const HERO_VARIANTS = ['paper', 'navy'] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

const VARIANT_SURFACE: Record<HeroVariant, BaconSurface> = { paper: 'paper', navy: 'navy' };

export interface HeroProps {
  children: React.ReactNode;
  variant?: HeroVariant;
  testID?: string;
}

export function Hero({
  children,
  variant = 'paper',
  testID = 'bacon-hero',
}: HeroProps): React.JSX.Element {
  const theme = useBaconTheme();
  const surface = VARIANT_SURFACE[variant];

  const heroStyle = useMemo<ViewStyle>(
    () => ({
      minHeight: baconLayout.heroHeight,
      backgroundColor: theme.surfaces[surface].background,
      paddingHorizontal: baconSpacing.screen,
      paddingTop: baconSpacing.screen,
      gap: baconSpacing.md,
      // Top-weighted, never centred in the empty space.
      justifyContent: 'flex-start',
      ...(variant === 'navy'
        ? {
            borderBottomLeftRadius: baconRadii.hero,
            borderBottomRightRadius: baconRadii.hero,
          }
        : null),
    }),
    [theme, surface, variant],
  );

  return (
    <BaconSurfaceProvider surface={surface}>
      <View style={heroStyle} testID={testID}>
        <View style={styles.content}>{children}</View>
      </View>
    </BaconSurfaceProvider>
  );
}

const styles = StyleSheet.create({
  /**
   * The guide observes that hero content sits in the top ~100pt of the ~250pt hero. That is a
   * description of where the content lands, not a clip: top-alignment plus the 250pt minimum
   * produces it, and a hard maxHeight would truncate a long balance at large text sizes.
   */
  content: { gap: baconSpacing.md },
});
