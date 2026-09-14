import type { Preview } from '@storybook/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BaconThemeProvider } from '@druloloy/bacon-ui';

/**
 * Every story renders inside the real provider, so the catalogue and the app resolve tokens the
 * same way. Stories pick their own ground with the `OnSurface` helper in `stories/decorators`.
 */
const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <BaconThemeProvider>
          <Story />
        </BaconThemeProvider>
      </SafeAreaProvider>
    ),
  ],
};

export default preview;
