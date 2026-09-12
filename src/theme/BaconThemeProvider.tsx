import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  createBaconTheme,
  baconTheme as defaultTheme,
  type BaconSurface,
  type BaconTheme,
  type BaconThemeConfig,
  type SurfaceTreatment,
} from './baconTheme';

const ThemeContext = createContext<BaconTheme>(defaultTheme);

/**
 * The current ground. Defaults to `paper`, because a Bacon app that renders a component outside
 * any screen is almost certainly on a money screen.
 */
const SurfaceContext = createContext<BaconSurface>('paper');

export interface BaconThemeProviderProps extends Partial<BaconThemeConfig> {
  children: ReactNode;
}

/**
 * Wraps the app once, at the root.
 *
 * The provider carries the token set and two pieces of app-level configuration that the Brand
 * Guide leaves to the implementation: how Quicksand's weights resolve to font families on this
 * platform, and whether filled red surfaces use the darkened accessible red.
 */
export function BaconThemeProvider({
  children,
  ...config
}: BaconThemeProviderProps): React.JSX.Element {
  const theme = useMemo(
    () => createBaconTheme(config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.useAccessibleRed, config.fontStrategy, config.fontFamilyMap],
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/**
 * Declares the ground for a subtree.
 *
 * Every Bacon surface that changes the background — a screen, a tile, a panel, a sheet — wraps
 * its children in one of these. Components below then read `useBaconSurface()` instead of being
 * passed colours, which is how "never muted text on a coloured surface" stops being a rule
 * someone has to remember.
 */
export function BaconSurfaceProvider({
  surface,
  children,
}: {
  surface: BaconSurface;
  children: ReactNode;
}): React.JSX.Element {
  return <SurfaceContext.Provider value={surface}>{children}</SurfaceContext.Provider>;
}

export function useBaconTheme(): BaconTheme {
  return useContext(ThemeContext);
}

export interface UseBaconSurfaceResult extends SurfaceTreatment {
  readonly surface: BaconSurface;
}

export function useBaconSurface(): UseBaconSurfaceResult {
  const theme = useBaconTheme();
  const surface = useContext(SurfaceContext);
  const treatment = theme.surfaces[surface];
  return useMemo(() => ({ surface, ...treatment }), [surface, treatment]);
}

/** Convenience for components that only need to know "am I on a coloured ground?". */
export function useOnColorSurface(): boolean {
  return useBaconSurface().onColor;
}
