import { StyleSheet, View } from 'react-native';
import { baconColors } from '../foundations/colors';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { formatPercent } from '../utils/formatting';
import { statAccessibilityLabel } from '../utils/accessibility';
import { BaconText } from '../atoms/BaconText';
import { BaconSurfaceProvider, useBaconTheme } from '../theme';

/**
 * The three-up statistic tile.
 *
 * BRAND GUIDE REQUIREMENT (09): "Always the word *remaining*, never *used*. Red at zero."
 *
 * The word is hardcoded. There is no `unit`, `caption` or `label` override, because "used" is the
 * inversion the guide explicitly forbids and a prop is how it would come back.
 *
 * BRAND GUIDE REQUIREMENT (12): "Status never carried by colour alone: the red tile keeps its
 * minus sign and its 0%." The percentage is always rendered, and the accessible label says
 * "nothing left" at zero so the red is not the only signal.
 */
export interface StatTileProps {
  label: string;
  /** 0–100. Zero turns the tile red. */
  percent: number;
  testID?: string;
}

export function StatTile({
  label,
  percent,
  testID = 'bacon-stat-tile',
}: StatTileProps): React.JSX.Element {
  const theme = useBaconTheme();
  const isZero = percent <= 0;
  const background = isZero ? theme.surfaces.red.background : baconColors.navy900;

  return (
    <View
      style={[styles.tile, { backgroundColor: background }]}
      accessible
      accessibilityLabel={statAccessibilityLabel(label, percent)}
      testID={testID}
    >
      {/* Inside the tile the ground is navy or red, so meta text is automatically the 16pt/500
          role rather than muted grey (Brand Guide 12). */}
      <BaconSurfaceProvider surface={isZero ? 'red' : 'navy'}>
        <BaconText
          variant="meta"
          align="center"
          importantForAccessibility="no"
          numberOfLines={1}
        >
          {label}
        </BaconText>
        <BaconText variant="sectionHeading" align="center" importantForAccessibility="no">
          {formatPercent(percent)}
        </BaconText>
        <BaconText variant="meta" align="center" importantForAccessibility="no">
          remaining
        </BaconText>
      </BaconSurfaceProvider>
    </View>
  );
}

export interface StatTileRowProps {
  /** Three is the documented arrangement. */
  stats: readonly StatTileProps[];
  testID?: string;
}

export function StatTileRow({ stats, testID }: StatTileRowProps): React.JSX.Element {
  return (
    <View style={styles.row} testID={testID}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.cell}>
          <StatTile {...stat} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: baconRadii.card,
    paddingVertical: baconSpacing.screen,
    paddingHorizontal: baconSpacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: baconSpacing.xs,
  },
  row: { flexDirection: 'row', gap: baconSpacing.md },
  cell: { flex: 1 },
});
