import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { BaconScreen } from '../atoms/BaconScreen';
import { BaconFab } from '../atoms/BaconFab';
import { Hero, type HeroVariant } from '../organisms/Hero';

/**
 * Archetype 1 — Hero + feed (and 1b, the navy-hero variant).
 *
 * BRAND GUIDE REQUIREMENT (10): "Paper hero with the balance and one action, then sections of
 * tiles and row links. The dashboard and both wallet lists." Archetype 1b is "the same archetype,
 * navy hero. Used when the screen is about one wallet type rather than everything."
 *
 * ARCHITECTURAL DECISION: 1 and 1b are one template with a `heroVariant`, not two, because the
 * guide itself calls 1b "the same archetype". Duplicating it would be abstraction for its own
 * sake — and would let the two drift apart.
 *
 * BRAND GUIDE REQUIREMENT (09 / 11): the FAB is the only persistent navigation, and it belongs on
 * money screens. There is no tab-bar slot here and none in the package.
 */
export interface HeroFeedTemplateProps {
  /** The balance, its eye toggle, and at most one action. */
  hero: React.ReactNode;
  /** Sections of tiles and row links, separated by the 40pt section gap. */
  children: React.ReactNode;
  heroVariant?: HeroVariant;
  /** Omit to render the screen without the app switcher. */
  onFabPress?: () => void;
  testID?: string;
}

export function HeroFeedTemplate({
  hero,
  children,
  heroVariant = 'paper',
  onFabPress,
  testID,
}: HeroFeedTemplateProps): React.JSX.Element {
  return (
    <BaconScreen
      variant="money"
      scroll
      edgeToEdge
      testID={testID}
      footer={onFabPress ? <FabFooter onPress={onFabPress} /> : undefined}
    >
      <Hero variant={heroVariant}>{hero}</Hero>
      <View style={styles.feed}>{children}</View>
    </BaconScreen>
  );
}

function FabFooter({ onPress }: { onPress: () => void }): React.JSX.Element {
  return (
    <View style={styles.fab}>
      <BaconFab onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {
    paddingHorizontal: baconSpacing.screen,
    paddingTop: baconSpacing.section,
    paddingBottom: baconSpacing.section,
    gap: baconSpacing.section,
  },
  fab: { paddingBottom: baconSpacing.screen },
});
