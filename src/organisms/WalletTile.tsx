import { useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { baconCardShadow, baconFlat } from '../foundations/elevation';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { walletAccessibilityLabel, type WalletStatus } from '../utils/accessibility';
import { type FormatMoneyOptions } from '../utils/formatting';
import { BaconText } from '../atoms/BaconText';
import { BaconMoneyDisplay } from '../atoms/BaconMoneyDisplay';
import { BaconProgressBar } from '../atoms/BaconProgressBar';
import { BaconSurfaceProvider, useBaconTheme, type BaconSurface } from '../theme';

/**
 * The central Bacon surface.
 *
 * BRAND GUIDE REQUIREMENT (09): "Order is fixed: emoji + category, wallet name, amount, period or
 * target, progress. Three states and no more — **white** normal, **solid red** for over budget or
 * zero remaining, **solid navy** for a priority savings goal."
 *
 * The order is the component's structure, not a prop, and `state` is a closed union. There is no
 * `backgroundColor`, `textColor` or `borderRadius` prop: a tile that needs to look different is
 * either one of the three states or a fork of the system.
 */
export const WALLET_TILE_STATES = ['normal', 'overBudget', 'prioritySavings'] as const;
export type WalletTileState = (typeof WALLET_TILE_STATES)[number];

const STATE_SURFACE: Record<WalletTileState, BaconSurface> = {
  normal: 'white',
  overBudget: 'red',
  prioritySavings: 'navy',
};

export interface WalletCategory {
  /** The category emoji. Never an icon (Brand Guide 13). */
  emoji: string;
  label: string;
}

export interface WalletProgress {
  percent: number;
  /** The number shown in the boundary chip. */
  value?: number;
}

export interface WalletTileProps {
  name: string;
  amount: number;
  category?: WalletCategory;
  /** The period ("Monthly") or the target ("target 25,000"). */
  meta?: string;
  progress?: WalletProgress;
  state?: WalletTileState;
  onPress?: () => void;
  currency?: FormatMoneyOptions;
  testID?: string;
}

export function WalletTile({
  name,
  amount,
  category,
  meta,
  progress,
  state = 'normal',
  onPress,
  currency,
  testID = 'bacon-wallet-tile',
}: WalletTileProps): React.JSX.Element {
  const theme = useBaconTheme();
  const surface = STATE_SURFACE[state];

  const tileStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: theme.surfaces[surface].background,
      borderRadius: baconRadii.card,
      padding: baconSpacing.screen,
      alignItems: 'center',
      gap: baconSpacing.xs,
      // BRAND GUIDE (07): the one shadow belongs to white cards on paper. A coloured tile is flat;
      // its separation comes from the fill.
      ...(state === 'normal' ? baconCardShadow : baconFlat),
    }),
    [theme, surface, state],
  );

  const label = walletAccessibilityLabel({
    name,
    category: category?.label,
    amount,
    status: state as WalletStatus,
    meta,
    currency,
  });

  const body = (
    <View style={tileStyle} testID={testID}>
      <BaconSurfaceProvider surface={surface}>
        {category ? (
          <View style={styles.category} testID="bacon-wallet-category">
            <BaconText
              variant="meta"
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {category.emoji}
            </BaconText>
            <BaconText variant="meta" align="center" importantForAccessibility="no">
              {category.label}
            </BaconText>
          </View>
        ) : null}

        <BaconText
          variant="walletName"
          align="center"
          numberOfLines={1}
          importantForAccessibility="no"
          testID="bacon-wallet-name"
        >
          {name}
        </BaconText>

        <BaconMoneyDisplay
          amount={amount}
          variant="tile"
          align="center"
          currency={currency}
          testID="bacon-wallet-amount"
        />

        {meta ? (
          <BaconText
            variant="meta"
            align="center"
            importantForAccessibility="no"
            testID="bacon-wallet-meta"
          >
            {meta}
          </BaconText>
        ) : null}

        {progress ? (
          <View style={styles.progress} testID="bacon-wallet-progress">
            <BaconProgressBar
              percent={progress.percent}
              value={progress.value}
              currency={currency}
            />
          </View>
        ) : null}
      </BaconSurfaceProvider>
    </View>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={label}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => (pressed ? styles.pressed : null)}
    >
      {body}
    </Pressable>
  );
}

export interface WalletGridProps {
  children: React.ReactNode;
  testID?: string;
}

/**
 * The 2-up wallet grid (Brand Guide 07: "2 columns, 150pt wide, 20pt gap").
 *
 * Columns stretch to fill the available width rather than being pinned at 150pt, so the 20pt
 * gutter and 20pt gap survive up to the 480pt maximum without scaling every measurement.
 */
export function WalletGrid({
  children,
  testID = 'bacon-wallet-grid',
}: WalletGridProps): React.JSX.Element {
  return (
    <View style={styles.grid} testID={testID}>
      {(Array.isArray(children) ? children : [children]).map((child, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={index} style={styles.cell}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: baconSpacing.xs,
  },
  progress: { alignSelf: 'stretch', marginTop: baconSpacing.sm },
  pressed: { opacity: 0.9 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: baconLayout.columnGap,
  },
  /**
   * `flexBasis: 0` with `flexGrow: 1` gives two equal columns that consume exactly the width left
   * after the 20pt gap, which is what the measured 150/20/150 grid is at the 360pt base width.
   */
  cell: { flexGrow: 1, flexBasis: 0, minWidth: 140 },
});
