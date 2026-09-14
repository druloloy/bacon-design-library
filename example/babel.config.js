module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Storybook's on-device UI uses @gorhom/bottom-sheet, which runs on Reanimated. The plugin
    // must be listed last, and without it the app throws at startup rather than at build time.
    plugins: ['react-native-reanimated/plugin'],
  };
};
