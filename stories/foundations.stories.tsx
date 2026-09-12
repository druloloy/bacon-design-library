import type { Meta, StoryObj } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import {
  BaconText,
  baconColors,
  baconIllustrationColors,
  baconRadii,
  baconSpacing,
  baconContrast,
  baconCardShadow,
  baconLayout,
  BACON_SPACING_SCALE,
} from '../src';
import { OnSurface } from './decorators';

const meta: Meta = {
  title: 'Foundations',
  parameters: {
    notes:
      'The token layer. Every value here is sampled or measured from the Bacon library; nothing ' +
      'is rounded or invented. Adding to any of these is a change to the brand, not a feature.',
  },
};
export default meta;

export const Palette: StoryObj = {
  name: 'Colour / the eight UI colours',
  render: () => (
    <OnSurface surface="paper">
      <View style={styles.swatches}>
        {Object.entries(baconColors).map(([name, value]) => (
          <View key={name} style={styles.swatch}>
            <View style={[styles.chip, { backgroundColor: value }]} />
            <BaconText variant="label" align="left">
              {name}
            </BaconText>
            <BaconText variant="meta" align="left">
              {value}
            </BaconText>
          </View>
        ))}
      </View>
    </OnSurface>
  ),
};

export const IllustrationOnly: StoryObj = {
  name: 'Colour / illustration accents — art only, never UI',
  parameters: {
    notes:
      'These are exported from `baconIllustrationColors` and are deliberately absent from the ' +
      'theme, so no component can reach them through useBaconTheme(). They are never a status.',
  },
  render: () => (
    <OnSurface surface="paper">
      <View style={styles.swatches}>
        {Object.entries(baconIllustrationColors).map(([name, value]) => (
          <View key={name} style={styles.swatch}>
            <View style={[styles.chip, { backgroundColor: value }]} />
            <BaconText variant="label" align="left">
              {name}
            </BaconText>
            <BaconText variant="meta" align="left">
              {value}
            </BaconText>
          </View>
        ))}
      </View>
    </OnSurface>
  ),
};

export const SemanticBackgrounds: StoryObj = {
  name: 'Colour / background means something',
  parameters: {
    notes:
      'Brand Guide 04 — "If the screen changes the user\'s money, it is light. If it changes the ' +
      'app or the account, it is navy." This is not a light/dark theme: both exist at once.',
  },
  render: () => (
    <View>
      <OnSurface surface="paper">
        <BaconText variant="cardTitle" align="left">
          Money screens — Paper
        </BaconText>
        <BaconText variant="body" align="left">
          Dashboard · Budgets · Savings · every create and update flow · completion · profile
        </BaconText>
      </OnSurface>
      <OnSurface surface="navy">
        <BaconText variant="cardTitle" align="left">
          System screens — Navy
        </BaconText>
        <BaconText variant="body" align="left">
          Settings · Security · Notifications · My Data · Customization
        </BaconText>
      </OnSurface>
    </View>
  ),
};

export const Spacing: StoryObj = {
  name: 'Spacing / 4 · 8 · 12 · 20 · 40, nothing else',
  render: () => (
    <OnSurface surface="paper">
      {BACON_SPACING_SCALE.map((value) => (
        <View key={value} style={styles.spacingRow}>
          <View style={[styles.spacingBar, { width: value * 4, height: value }]} />
          <BaconText variant="meta" align="left">
            {String(value)}
          </BaconText>
        </View>
      ))}
      <BaconText variant="body" align="left">
        If a gap wants to be 16, it is 12 or 20.
      </BaconText>
    </OnSurface>
  ),
};

export const Radii: StoryObj = {
  name: 'Radii / card 16, hero 24, pill',
  render: () => (
    <OnSurface surface="paper">
      <View style={styles.radii}>
        <View style={[styles.radiusBox, { borderRadius: baconRadii.card }]} />
        <View
          style={[
            styles.radiusBox,
            {
              borderBottomLeftRadius: baconRadii.hero,
              borderBottomRightRadius: baconRadii.hero,
            },
          ]}
        />
        <View style={[styles.radiusBox, styles.radiusPill]} />
      </View>
    </OnSurface>
  ),
};

export const Elevation: StoryObj = {
  name: 'Elevation / exactly one shadow',
  parameters: {
    notes:
      'Brand Guide 07 — "No second elevation level, no hover lift, no inner shadows." Navy ' +
      'panels are separated by a tint step instead.',
  },
  render: () => (
    <OnSurface surface="paper">
      <View style={[styles.card, baconCardShadow]}>
        <BaconText variant="cardTitle" align="left">
          0 4px 16px rgba(19,32,88,.06)
        </BaconText>
        <BaconText variant="meta" align="left">
          White cards on paper only
        </BaconText>
      </View>
    </OnSurface>
  ),
};

export const Geometry: StoryObj = {
  name: 'Layout / the measured frame',
  render: () => (
    <OnSurface surface="paper">
      {(
        [
          [
            'Frame',
            `${baconLayout.frameWidth} × ${baconLayout.frameHeight}pt, fluid to ${baconLayout.maxContentWidth}`,
          ],
          ['Gutter', `${baconLayout.gutter}pt left and right, every screen`],
          [
            'Grid',
            `${baconLayout.gridColumns} columns, ${baconLayout.columnWidth}pt wide, ${baconLayout.columnGap}pt gap`,
          ],
          [
            'Hero',
            `≈ ${baconLayout.heroHeight}pt, content in the top ${baconLayout.heroContentHeight}pt`,
          ],
          ['Top bar', `${baconLayout.topBarHeight}pt, transparent, no shadow`],
          ['Tap target', `${baconLayout.minTapTarget}pt minimum`],
          ['FAB', `${baconLayout.fabSize}pt navy circle`],
          ['Progress bar', `${baconLayout.progressBarHeight}pt pill`],
          ['Row link', `${baconLayout.rowLinkHeight}pt tall`],
        ] as const
      ).map(([label, value]) => (
        <View key={label} style={styles.specRow}>
          <BaconText variant="label" align="left" style={styles.specKey}>
            {label}
          </BaconText>
          <BaconText variant="meta" align="left" style={styles.specValue}>
            {value}
          </BaconText>
        </View>
      ))}
    </OnSurface>
  ),
};

export const Contrast: StoryObj = {
  name: 'Accessibility / the documented contrast ratios',
  render: () => (
    <OnSurface surface="paper">
      {Object.entries(baconContrast).map(([pair, ratio]) => (
        <View key={pair} style={styles.specRow}>
          <BaconText variant="label" align="left" style={styles.specKey}>
            {pair}
          </BaconText>
          <BaconText variant="meta" align="left" style={styles.specValue}>
            {`${ratio} : 1`}
          </BaconText>
        </View>
      ))}
      <BaconText variant="body" align="left">
        White on Signal Red is large-text only — meta on a red surface is raised to 16pt / 500.
      </BaconText>
    </OnSurface>
  ),
};

const styles = StyleSheet.create({
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: baconSpacing.screen },
  swatch: { width: 150, gap: baconSpacing.xs },
  chip: {
    height: 80,
    borderRadius: baconRadii.card,
    borderWidth: 1,
    borderColor: baconColors.track,
  },
  spacingRow: { flexDirection: 'row', alignItems: 'center', gap: baconSpacing.md },
  spacingBar: { backgroundColor: baconColors.navy900, borderRadius: baconRadii.pill },
  radii: { flexDirection: 'row', gap: baconSpacing.screen },
  radiusBox: { width: 80, height: 56, backgroundColor: baconColors.navy900 },
  radiusPill: { height: 36, borderRadius: baconRadii.pill },
  card: {
    backgroundColor: baconColors.white,
    borderRadius: baconRadii.card,
    padding: baconSpacing.screen,
    gap: baconSpacing.xs,
  },
  specRow: { flexDirection: 'row', gap: baconSpacing.md, paddingVertical: baconSpacing.xs },
  specKey: { width: 120 },
  specValue: { flexShrink: 1 },
});
