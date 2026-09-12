import { StyleSheet, View } from 'react-native';
import {
  BaconSurfaceProvider,
  BaconThemeProvider,
  baconLayout,
  baconSpacing,
  baconTokens,
  type BaconSurface,
} from '../src';

/**
 * Shared story scaffolding.
 *
 * Every story renders on an explicit Bacon ground, because a component's appearance is decided by
 * the surface it sits on. A catalogue that showed everything on white would misrepresent the
 * system.
 */
export function OnSurface({
  surface,
  children,
  frame = false,
}: {
  surface: BaconSurface;
  children: React.ReactNode;
  /** Constrain to the 360pt design frame, for layout-sensitive stories. */
  frame?: boolean;
}): React.JSX.Element {
  return (
    <BaconThemeProvider>
      <View
        style={[
          styles.stage,
          { backgroundColor: baconTokens.colors[surfaceToken(surface)] },
          frame ? styles.frame : null,
        ]}
      >
        <BaconSurfaceProvider surface={surface}>{children}</BaconSurfaceProvider>
      </View>
    </BaconThemeProvider>
  );
}

function surfaceToken(
  surface: BaconSurface,
): 'paper' | 'white' | 'navy900' | 'navy700' | 'red' {
  switch (surface) {
    case 'navy':
      return 'navy900';
    case 'panel':
      return 'navy700';
    case 'red':
      return 'red';
    case 'white':
      return 'white';
    default:
      return 'paper';
  }
}

/** Lays story variants out with the documented stack gap. */
export function Stack({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <View style={styles.stack}>{children}</View>;
}

const styles = StyleSheet.create({
  stage: { padding: baconSpacing.screen, gap: baconSpacing.screen },
  frame: { width: baconLayout.frameWidth, alignSelf: 'flex-start' },
  stack: { gap: baconSpacing.screen },
});
