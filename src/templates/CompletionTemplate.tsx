import { StyleSheet, View } from 'react-native';
import { baconSpacing } from '../foundations/spacing';
import { BaconScreen } from '../atoms/BaconScreen';
import { BaconText } from '../atoms/BaconText';
import { TopBar } from '../molecules/TopBar';
import { RowLink, type RowLinkProps } from '../organisms/RowLink';

/**
 * Archetype 4 — Completion.
 *
 * BRAND GUIDE REQUIREMENT (10): "CLOSE only, Light headline, line-art illustration, one line of
 * consequence, two row links out. Never a modal."
 *
 * BRAND GUIDE REQUIREMENT (11): "No toasts. Confirmation is a full screen, not a transient
 * message. If something succeeded, say what now exists and offer two ways onward."
 *
 * BRAND GUIDE REQUIREMENT (02): "Completion screens name the thing created, then give one line of
 * consequence… and two ways onward. No exclamation stacking, no 'well done'."
 *
 * `links` is typed as a pair, not an array, so "two ways onward" is checked by the compiler. The
 * package ships no toast or snackbar component for the same reason.
 */
export type CompletionLink = Omit<RowLinkProps, 'testID'>;

export interface CompletionTemplateProps {
  /** Names what now exists: "You have created a new savings account!" */
  headline: string;
  /** One line of consequence: "Fill your account before August 8, 2025." */
  consequence?: string;
  /**
   * The line-art illustration. This is the one place the illustration accents are legal —
   * see `baconIllustrationColors`, which is deliberately outside the theme.
   */
  illustration?: React.ReactNode;
  /** Exactly two ways onward. */
  links: readonly [CompletionLink, CompletionLink];
  onClose: () => void;
  testID?: string;
}

export function CompletionTemplate({
  headline,
  consequence,
  illustration,
  links,
  onClose,
  testID,
}: CompletionTemplateProps): React.JSX.Element {
  return (
    <BaconScreen variant="money" scroll testID={testID}>
      {/* CLOSE only — there is nothing to go back to (Brand Guide 10). */}
      <TopBar onClose={onClose} />

      <BaconText variant="pageTitle" align="center" heading style={styles.headline}>
        {headline}
      </BaconText>

      {illustration ? (
        <View
          style={styles.illustration}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          testID="bacon-completion-illustration"
        >
          {illustration}
        </View>
      ) : null}

      {consequence ? (
        <BaconText variant="body" align="center" style={styles.consequence}>
          {consequence}
        </BaconText>
      ) : null}

      <View style={styles.links}>
        {links.map((link) => (
          <RowLink key={link.title} {...link} />
        ))}
      </View>
    </BaconScreen>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: baconSpacing.screen },
  illustration: { alignItems: 'center', marginTop: baconSpacing.section },
  consequence: { marginTop: baconSpacing.section },
  links: { marginTop: baconSpacing.section, gap: baconSpacing.screen },
});
