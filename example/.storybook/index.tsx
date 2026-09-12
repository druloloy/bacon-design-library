import { view } from './storybook.requires';

/**
 * The Storybook entry point.
 *
 * Storybook lives in the example app rather than in the package, so the library ships no
 * Storybook dependency at all. The stories themselves live in the package (`stories/`), which
 * keeps them next to the components they document.
 */
const StorybookUIRoot = view.getStorybookUI({
  storage: { getItem: async () => null, setItem: async () => undefined },
});

export default StorybookUIRoot;
