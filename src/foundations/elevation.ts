import { Platform, type ViewStyle } from 'react-native';
import { baconColors } from './colors';

/**
 * Bacon elevation foundation.
 *
 * BRAND GUIDE REQUIREMENT (07): "Exactly one shadow exists: 0 4px 16px rgba(19,32,88,.06), on
 * white cards sitting on paper. Everything else is flat. No second elevation level, no hover
 * lift, no inner shadows."
 *
 * There is therefore no `elevation.sm/md/lg` ramp in this package, and adding one is a breaking
 * change to the brand rather than a feature.
 */
export const BACON_SHADOW_SPEC = {
  offsetX: 0,
  offsetY: 4,
  blur: 16,
  color: baconColors.navy900,
  opacity: 0.06,
} as const;

/**
 * The one shadow, expressed for React Native.
 *
 * ENGINEERING DECISION: Android's `elevation` cannot reproduce a coloured, offset, low-opacity
 * shadow; `elevation: 2` is the closest visual match to a 16px blur at 6% and is what the RN
 * shadow props degrade to. iOS uses the exact spec.
 */
export const baconCardShadow: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: BACON_SHADOW_SPEC.color,
    shadowOffset: { width: BACON_SHADOW_SPEC.offsetX, height: BACON_SHADOW_SPEC.offsetY },
    shadowRadius: BACON_SHADOW_SPEC.blur / 2,
    shadowOpacity: BACON_SHADOW_SPEC.opacity,
  },
  android: { elevation: 2, shadowColor: BACON_SHADOW_SPEC.color },
  default: {
    shadowColor: BACON_SHADOW_SPEC.color,
    shadowOffset: { width: BACON_SHADOW_SPEC.offsetX, height: BACON_SHADOW_SPEC.offsetY },
    shadowRadius: BACON_SHADOW_SPEC.blur / 2,
    shadowOpacity: BACON_SHADOW_SPEC.opacity,
  },
});

/** Explicitly flat. Used by navy panels and by coloured tiles, which never carry a shadow. */
export const baconFlat: ViewStyle = {
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
  elevation: 0,
};
