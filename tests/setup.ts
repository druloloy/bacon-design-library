import '@testing-library/react-native/extend-expect';

/**
 * react-native-safe-area-context is an optional peer dependency, so tests pin it to a
 * deterministic 360 x 800 frame with no insets — the Brand Guide's design frame.
 */
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 360, height: 800 };
  return {
    SafeAreaProvider: ({ children }: { children: unknown }) => children,
    SafeAreaView: jest.requireActual('react-native').View,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { frame, insets },
  };
});

// Silences the animated-helper warning that leaks out of the react-native jest preset.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
