import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // The stories live in the package, beside the components they document.
  stories: ['../../stories/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [],
};

export default main;
