import { View, StyleSheet } from 'react-native';
import {
  CompletionTemplate,
  baconIllustrationColors,
  baconRadii,
  baconSpacing,
} from '@druloloy/bacon-ui';
import type { Budget, Route } from '../types';

/**
 * Archetype 4 — Completion.
 *
 * Consequence, not congratulation, and two ways onward. A toast would be the wrong shape here:
 * "confirmation is a full screen, not a transient message" (Brand Guide 11).
 */
export function CompletionScreen({
  draft,
  onClose,
  onNavigate,
}: {
  draft: Budget;
  onClose: () => void;
  onNavigate: (route: Route) => void;
}): React.JSX.Element {
  return (
    <CompletionTemplate
      headline={`You have created ${draft.name || 'a new budget account'}!`}
      consequence="Fill your account before August 8, 2025."
      illustration={<Illustration />}
      links={[
        {
          title: 'My Budgets',
          subtitle: 'See where this one sits',
          onPress: () => onNavigate('dashboard'),
        },
        {
          title: 'Add another',
          subtitle: 'Three short steps',
          onPress: () => onNavigate('createName'),
        },
      ]}
      onClose={onClose}
    />
  );
}

/**
 * A placeholder for the line-art illustration.
 *
 * This is the one place the illustration accents are legal, and they are reached through
 * `baconIllustrationColors` — which is deliberately outside the theme, so no UI component can
 * pick them up as a status colour.
 */
function Illustration(): React.JSX.Element {
  return (
    <View style={styles.art}>
      <View style={[styles.disc, { backgroundColor: baconIllustrationColors.lavender }]} />
      <View style={[styles.bar, { backgroundColor: baconIllustrationColors.violet }]} />
      <View style={[styles.bar, { backgroundColor: baconIllustrationColors.green }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  art: { alignItems: 'center', gap: baconSpacing.md },
  disc: { width: 120, height: 120, borderRadius: baconRadii.pill },
  bar: { width: 80, height: 8, borderRadius: baconRadii.pill },
});
