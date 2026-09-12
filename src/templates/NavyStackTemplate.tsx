import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { BaconScreen } from '../atoms/BaconScreen';
import { BaconText } from '../atoms/BaconText';
import { TopBar } from '../molecules/TopBar';

/**
 * Archetype 3 — Navy stack.
 *
 * BRAND GUIDE REQUIREMENT (10): "Light title, then grouped 2-up panels under small bold group
 * labels. All account and system screens."
 *
 * BRAND GUIDE REQUIREMENT (04): this template is hard-wired to the navy ground, because the
 * background is the signal that the user is in settings rather than in their money. There is no
 * variant prop — a system screen that wants to be light is a product mistake, not a styling one.
 */
export interface NavyStackTemplateProps {
  /** The Light page title: "Settings", "Notifications", "Security". */
  title: string;
  /** PanelGroups. */
  children: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  testID?: string;
}

export function NavyStackTemplate({
  title,
  children,
  onBack,
  onClose,
  testID,
}: NavyStackTemplateProps): React.JSX.Element {
  return (
    <BaconScreen variant="system" scroll testID={testID}>
      <TopBar onBack={onBack} onClose={onClose} />
      <BaconText variant="pageTitle" align="center" heading style={styles.title}>
        {title}
      </BaconText>
      <View style={styles.groups}>{children}</View>
    </BaconScreen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: baconSpacing.screen, marginBottom: baconSpacing.section },
  groups: { gap: baconSpacing.section, paddingBottom: baconSpacing.section },
});
