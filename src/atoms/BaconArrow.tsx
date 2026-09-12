import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useBaconSurface } from '../theme';

/**
 * The long arrow.
 *
 * It appears in exactly two places: the back control and the forward action in the top bar, and
 * the right-hand affordance on a row link (Brand Guide 08 / 09).
 *
 * ENGINEERING DECISION: this is drawn from Views rather than an SVG path. `react-native-svg` would
 * be a native peer dependency for two glyphs, and forcing a native linking step on every consumer
 * for decoration is a poor trade. The geometry reproduces the guide's own stroke — a 2pt shaft the
 * full width of the glyph and a chevron head reaching 7 of 24 units back from the tip — using a
 * square with two borders rotated 45°.
 */
export interface BaconArrowProps {
  direction?: 'left' | 'right';
  /** Overall length. The head scales with it. */
  size?: number;
  /** Defaults to the current surface's text colour. */
  color?: string;
  testID?: string;
}

const STROKE = 2;
const DEFAULT_SIZE = 24;
/** The guide's head reaches 7 of 24 units back from the tip. */
const HEAD_RATIO = 7 / 24;

export function BaconArrow({
  direction = 'right',
  size = DEFAULT_SIZE,
  color,
  testID,
}: BaconArrowProps): React.JSX.Element {
  const surface = useBaconSurface();
  const stroke = color ?? surface.text;

  // A square of side `s` carrying two adjacent borders, rotated 45°, is a chevron whose tip
  // reaches `s / √2` beyond its own centre. Solving for a head depth of `size * 7/24`:
  const headDepth = size * HEAD_RATIO;
  const square = headDepth * Math.SQRT2;

  const headStyle = useMemo<ViewStyle>(() => {
    const common: ViewStyle = {
      position: 'absolute',
      width: square,
      height: square,
      top: (size - square) / 2,
      borderTopWidth: STROKE,
      borderTopColor: stroke,
      transform: [{ rotate: '45deg' }],
    };
    return direction === 'right'
      ? {
          ...common,
          left: size - headDepth - square / 2,
          borderRightWidth: STROKE,
          borderRightColor: stroke,
        }
      : {
          ...common,
          left: headDepth - square / 2,
          borderLeftWidth: STROKE,
          borderLeftColor: stroke,
        };
  }, [direction, size, square, headDepth, stroke]);

  return (
    <View
      style={[styles.root, { width: size, height: size }]}
      accessibilityElementsHidden
      importantForAccessibility="no"
      testID={testID}
    >
      <View
        style={{
          width: size,
          height: STROKE,
          borderRadius: STROKE,
          backgroundColor: stroke,
        }}
        testID="bacon-arrow-shaft"
      />
      <View style={headStyle} testID="bacon-arrow-head" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
});
