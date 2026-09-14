import { Pressable, StyleSheet, View } from 'react-native';
import { baconColors } from '../foundations/colors';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { useBaconSurface } from '../theme';

/**
 * The app switcher.
 *
 * BRAND GUIDE REQUIREMENT (09): "56pt navy circle, centred on the bottom edge, 2×2 grid glyph.
 * The app switcher, and the only persistent navigation. Money screens only — this product has no
 * tab bar."
 *
 * This component is the whole of Bacon's persistent navigation. The design system deliberately
 * ships no tab bar and no navigator: navigation *mechanics* belong to the consuming app, and a
 * tab bar beside the FAB is one of the misuses the guide calls out by name (13).
 */
export interface BaconFabProps {
  onPress: () => void;
  /** Override only if the destination is genuinely not the app switcher. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

/** The 2×2 glyph: four rounded squares on a 24pt field, as drawn in the guide. */
const GLYPH_FIELD = 24;
const CELL = 8;
const CELL_GAP = 2;
const CELL_RADIUS = 1.6;

export function BaconFab({
  onPress,
  accessibilityLabel = 'Open app switcher',
  accessibilityHint,
  testID,
}: BaconFabProps): React.JSX.Element {
  const surface = useBaconSurface();

  if (__DEV__ && surface.onColor) {
    // eslint-disable-next-line no-console
    console.warn(
      '[@druloloy/bacon-ui] BaconFab is rendered on a coloured surface. The guide places the ' +
        'FAB on money screens only (Brand Guide 09) — a system screen has no persistent navigation.',
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => (pressed ? styles.pressed : null)}
      testID={testID}
    >
      <View style={styles.fab} testID="bacon-fab">
        <View style={styles.glyph}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={styles.cell} testID="bacon-fab-glyph-cell" />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: baconLayout.fabSize,
    height: baconLayout.fabSize,
    borderRadius: baconRadii.pill,
    backgroundColor: baconColors.navy900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    width: GLYPH_FIELD,
    height: GLYPH_FIELD,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: CELL_RADIUS,
    backgroundColor: baconColors.white,
  },
  pressed: { opacity: 0.85 },
});
