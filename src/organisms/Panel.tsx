import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { baconFlat } from '../foundations/elevation';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { BaconText } from '../atoms/BaconText';
import { BaconSurfaceProvider, useBaconTheme } from '../theme';

/**
 * A grouped panel on a navy screen.
 *
 * BRAND GUIDE REQUIREMENT (03): Navy 700 is "cards and grouped panels on a navy screen. No shadow,
 * no border." Separation comes from the tint step, never from elevation (04).
 *
 * BRAND GUIDE REQUIREMENT (10, archetype 3): "Light title, then grouped 2-up panels under small
 * bold group labels. All account and system screens."
 */
export interface PanelProps {
  children: React.ReactNode;
  testID?: string;
}

export function Panel({ children, testID = 'bacon-panel' }: PanelProps): React.JSX.Element {
  const theme = useBaconTheme();

  const panelStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: theme.surfaces.panel.background,
      borderRadius: baconRadii.card,
      padding: baconSpacing.screen,
      gap: baconSpacing.sm,
      ...baconFlat,
    }),
    [theme],
  );

  return (
    <BaconSurfaceProvider surface="panel">
      <View style={panelStyle} testID={testID}>
        {children}
      </View>
    </BaconSurfaceProvider>
  );
}

export interface PanelGroupProps {
  /** The small bold group label above the panels. */
  label: string;
  children: React.ReactNode;
  testID?: string;
}

export function PanelGroup({ label, children, testID }: PanelGroupProps): React.JSX.Element {
  return (
    <View style={styles.group} testID={testID}>
      <BaconText variant="label" align="left" heading>
        {label}
      </BaconText>
      <View style={styles.grid} testID="bacon-panel-group-grid">
        {(Array.isArray(children) ? children : [children]).map((child, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={index} style={styles.cell}>
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: baconSpacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: baconLayout.columnGap },
  cell: { flexGrow: 1, flexBasis: 0, minWidth: 140 },
});
