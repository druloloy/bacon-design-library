import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { BaconScreen } from '../atoms/BaconScreen';
import { BaconText } from '../atoms/BaconText';
import { TopBar, type BaconForwardAction } from '../molecules/TopBar';

/**
 * Archetype 2 — One question.
 *
 * BRAND GUIDE REQUIREMENT (10): "FINISH in the bar, Light title, then question → input → chips.
 * Three of these make the whole create flow."
 *
 * BRAND GUIDE REQUIREMENT (11): "One decision per screen. Creating a budget is three screens…
 * Never collapse them into one form to save taps. The step count is the feature." And: "Advance
 * from the top. Forward motion lives in the top-right of the bar, not in a button at the bottom
 * of the content."
 *
 * The template has no footer or bottom-CTA slot at all. A giant multi-field form and a bottom
 * "Submit" button are both named misuses (13), and neither is expressible here.
 */
export interface OneQuestionTemplateProps {
  /** The Light page title. Names where you are, centred. */
  title: string;
  /** The question, input and chips. One decision's worth. */
  children: React.ReactNode;
  onBack?: () => void;
  /** NEXT for an intermediate step, FINISH for the last one. */
  forwardAction?: BaconForwardAction;
  testID?: string;
}

export function OneQuestionTemplate({
  title,
  children,
  onBack,
  forwardAction,
  testID,
}: OneQuestionTemplateProps): React.JSX.Element {
  return (
    <BaconScreen variant="money" testID={testID}>
      <TopBar onBack={onBack} forwardAction={forwardAction} />
      <BaconText variant="pageTitle" align="center" heading style={styles.title}>
        {title}
      </BaconText>
      <View style={styles.body}>{children}</View>
      {/* The lower third is left empty, deliberately (Brand Guide 07). */}
    </BaconScreen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: baconSpacing.screen, marginBottom: baconSpacing.section },
  body: { gap: baconSpacing.section },
});
