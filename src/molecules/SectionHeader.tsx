import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { BaconText } from '../atoms/BaconText';

/**
 * A section heading with an optional trailing action.
 *
 * Brand Guide 06 — sentence case, never all-caps, left-aligned. The heading is announced as a
 * header so a screen-reader user can jump between the sections of a feed.
 */
export interface SectionHeaderProps {
  children: string;
  /** A trailing control, e.g. a period switcher. Kept to one, and never a second heading. */
  action?: React.ReactNode;
  testID?: string;
}

export function SectionHeader({
  children,
  action,
  testID,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.row} testID={testID}>
      <BaconText variant="sectionHeading" align="left" heading style={styles.title}>
        {children}
      </BaconText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: baconSpacing.md,
  },
  title: { flexShrink: 1 },
});
