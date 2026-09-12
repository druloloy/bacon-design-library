import { registerRootComponent } from 'expo';
import App from './App';
import StorybookUI from './.storybook';

/**
 * One binary, two entry points: the example screens, or the Storybook catalogue. Which one runs
 * is an env flag rather than a code change, so both stay compiled and neither rots.
 */
registerRootComponent(process.env.EXPO_PUBLIC_STORYBOOK === 'true' ? StorybookUI : App);
