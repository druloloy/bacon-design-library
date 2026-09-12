import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { baconColors } from '../foundations/colors';
import { baconLayout } from '../foundations/layout';
import { baconRadii } from '../foundations/radii';
import { baconSpacing } from '../foundations/spacing';
import { progressAccessibilityValue } from '../utils/accessibility';
import { formatMoney, type FormatMoneyOptions } from '../utils/formatting';
import { BaconSurfaceProvider, useBaconSurface, type BaconSurface } from '../theme';
import { BaconText } from './BaconText';

/**
 * The Bacon progress bar.
 *
 * BRAND GUIDE REQUIREMENT (09): "20pt tall pill. The value sits **on the boundary of the fill**
 * in a small white chip that straddles it. This is the most recognisable detail in the product —
 * do not replace it with a label above or beside the bar."
 *
 * The component has no `labelPosition` prop and no way to move the value off the boundary.
 */
export interface BaconProgressBarProps {
  /** 0–100. Values outside the range are clamped rather than rejected. */
  percent: number;
  /** The number shown in the boundary chip. Omit the chip by omitting the value. */
  value?: number;
  currency?: FormatMoneyOptions;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * The guide's chip sits at `translateX(-42%)` of its own width — slightly left of centre, so the
 * fill boundary reads through the middle of the chip rather than under its left edge.
 */
const CHIP_STRADDLE = 0.42;

/** The white outline the bar takes when its track is removed on a red surface. */
const OUTLINE_WIDTH = 1.5;

function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0;
  return Math.max(0, Math.min(100, percent));
}

export function BaconProgressBar({
  percent,
  value,
  currency,
  accessibilityLabel,
  testID,
}: BaconProgressBarProps): React.JSX.Element {
  const surface = useBaconSurface();
  const [chipWidth, setChipWidth] = useState(0);
  const clamped = clampPercent(percent);

  const onChipLayout = useCallback((event: LayoutChangeEvent) => {
    setChipWidth(event.nativeEvent.layout.width);
  }, []);

  const trackStyle = useMemo<ViewStyle>(() => {
    const base: ViewStyle = {
      height: baconLayout.progressBarHeight,
      borderRadius: baconRadii.pill,
      justifyContent: 'center',
    };
    if (surface.track === null) {
      // BRAND GUIDE (09): "The red tile's progress bar loses its track and becomes a white
      // outline… otherwise a full-width track reads as a bar that is already full."
      return {
        ...base,
        backgroundColor: 'transparent',
        borderWidth: OUTLINE_WIDTH,
        borderColor: baconColors.white,
      };
    }
    return { ...base, backgroundColor: surface.track };
  }, [surface.track]);

  const fillColor = surface.onColor ? baconColors.white : baconColors.navy900;

  /**
   * The chip is white with navy text on every surface except red, where it becomes bare white
   * text so it does not punch a light hole in a solid red tile.
   */
  const chipIsBare = surface.surface === 'red';
  const chipSurface: BaconSurface = chipIsBare ? 'navy' : 'white';

  const translateX = useMemo(() => {
    if (chipWidth === 0) return 0;
    // On a red tile there is no fill, so there is no boundary to straddle. The guide centres the
    // number instead of pinning it to the left edge (Brand Guide 09, the over-budget tile).
    if (chipIsBare) return -chipWidth / 2;
    if (clamped <= 0) return 0;
    if (clamped >= 100) return -chipWidth;
    return -chipWidth * CHIP_STRADDLE;
  }, [chipWidth, clamped, chipIsBare]);

  const chipStyle = useMemo<ViewStyle>(
    () => ({
      position: 'absolute',
      left: chipIsBare ? '50%' : `${clamped}%`,
      transform: [{ translateX }],
      paddingHorizontal: chipIsBare ? 0 : baconSpacing.sm,
      borderRadius: baconRadii.pill,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: baconLayout.progressBarHeight,
      ...(chipIsBare ? null : { backgroundColor: baconColors.white }),
    }),
    [clamped, translateX, chipIsBare],
  );

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={progressAccessibilityValue(clamped)}
      testID={testID}
    >
      <View style={trackStyle} testID="bacon-progress-track">
        <View
          style={[styles.fill, { width: `${clamped}%`, backgroundColor: fillColor }]}
          testID="bacon-progress-fill"
        />
        {value === undefined ? null : (
          <View style={chipStyle} onLayout={onChipLayout} testID="bacon-progress-chip">
            <BaconSurfaceProvider surface={chipSurface}>
              <BaconText variant="progressValue" align="center" importantForAccessibility="no">
                {formatMoney(value, { ...currency, showSymbol: false })}
              </BaconText>
            </BaconSurfaceProvider>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: baconRadii.pill,
  },
});
