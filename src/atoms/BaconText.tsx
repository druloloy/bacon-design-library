import { useMemo } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';
import {
  baconTypography,
  resolveFont,
  type BaconTextRole,
  type BaconTextVariant,
} from '../foundations/typography';
import { baconColors } from '../foundations/colors';
import { useBaconSurface, useBaconTheme } from '../theme';

/**
 * The only text primitive in Bacon.
 *
 * Brand Guide 06 — "Only these roles exist; a new piece of text takes the nearest role rather
 * than a new size." So `variant` is required and there is no `fontSize`, `fontWeight`, `color` or
 * `fontFamily` prop. A caller who needs text to look different picks a different role.
 */

/**
 * The controlled extension point.
 *
 * A design system that lets developers override every colour, radius, font and spacing value is
 * not enforcing anything — so `style` accepts layout properties only. Nothing here can change
 * what the text *looks* like, only where it sits.
 */
export type BaconTextLayoutStyle = Pick<
  TextStyle,
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'flex'
  | 'flexShrink'
  | 'flexGrow'
  | 'alignSelf'
  | 'width'
  | 'maxWidth'
>;

export interface BaconTextProps {
  /** Which documented role this text plays. */
  variant: BaconTextVariant;
  children: React.ReactNode;
  /**
   * Overrides the role's default alignment. The guide centres page titles, questions, inputs,
   * chips and wallet-tile contents, and left-aligns everything else.
   */
  align?: 'left' | 'center' | 'right';
  /**
   * The one non-surface colour a piece of text may take.
   *
   * BRAND GUIDE REQUIREMENT (04 — The red doctrine): "Status red is always a filled surface…
   * Destructive red is always bare text." This tone is the *text* half of that rule and is the
   * only way to make text red in the library. There is deliberately no "error", "warning" or
   * "danger" tone: red is not a generic warning colour in Bacon.
   */
  tone?: 'default' | 'destructive';
  /** Announce this text as a heading to assistive technology. */
  heading?: boolean;
  numberOfLines?: number;
  accessibilityLabel?: string;
  /** Hide purely decorative text (an emoji already named by its label) from screen readers. */
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  testID?: string;
  style?: BaconTextLayoutStyle;
  allowFontScaling?: boolean;
  maxFontSizeMultiplier?: number;
}

/** Roles the guide centres by default (Brand Guide 06 — Alignment). */
const CENTERED_BY_DEFAULT: ReadonlySet<BaconTextVariant> = new Set<BaconTextVariant>([
  'pageTitle',
  'question',
  'heroMoney',
]);

/** Roles whose colour is the surface's meta colour rather than its text colour. */
const META_ROLES: ReadonlySet<BaconTextVariant> = new Set<BaconTextVariant>([
  'meta',
  'metaOnColor',
]);

/**
 * ENGINEERING DECISION: Dynamic Type is honoured, but capped. At an unbounded multiplier the
 * 44pt hero money breaks a 150pt wallet tile. 1.6 is the largest multiplier at which every
 * documented layout still holds on the 360pt frame.
 */
const DEFAULT_MAX_FONT_SCALE = 1.6;

export function BaconText({
  variant,
  children,
  align,
  tone = 'default',
  heading = false,
  numberOfLines,
  accessibilityLabel,
  accessibilityElementsHidden,
  importantForAccessibility,
  testID,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = DEFAULT_MAX_FONT_SCALE,
}: BaconTextProps): React.JSX.Element {
  const theme = useBaconTheme();
  const surface = useBaconSurface();
  const onColor = surface.onColor;

  const textStyle = useMemo<TextStyle>(() => {
    /**
     * BRAND GUIDE REQUIREMENT (12 — Accessibility): "never put muted grey text on red" and
     * "raise meta text on a red surface to 16pt / 500". A 14pt meta role asked for on a coloured
     * ground is silently promoted to the 16pt / 500 role. The correction is applied by
     * construction, so no screen can reintroduce the original mistake.
     */
    const effectiveVariant: BaconTextVariant =
      variant === 'meta' && onColor ? 'metaOnColor' : variant;
    const role: BaconTextRole = baconTypography[effectiveVariant];

    const font = resolveFont(role.weight, theme.fontStrategy, theme.fontFamilyMap);
    const color =
      tone === 'destructive'
        ? baconColors.red
        : META_ROLES.has(effectiveVariant)
          ? surface.meta
          : surface.text;

    return {
      ...font,
      color,
      fontSize: role.fontSize,
      lineHeight: role.fontSize * role.lineHeightRatio,
      textAlign: align ?? (CENTERED_BY_DEFAULT.has(effectiveVariant) ? 'center' : 'left'),
      ...(role.letterSpacing === undefined ? null : { letterSpacing: role.letterSpacing }),
      ...(role.textTransform === undefined ? null : { textTransform: role.textTransform }),
    };
  }, [
    variant,
    tone,
    onColor,
    align,
    surface.meta,
    surface.text,
    theme.fontStrategy,
    theme.fontFamilyMap,
  ]);

  return (
    <Text
      style={StyleSheet.compose(textStyle, style as TextStyle)}
      numberOfLines={numberOfLines}
      accessibilityRole={heading ? 'header' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      testID={testID}
    >
      {children}
    </Text>
  );
}
