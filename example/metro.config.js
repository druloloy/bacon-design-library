const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * The example app consumes the design system through `file:..`, so Metro has to watch the
 * package root as well as this folder — and it must resolve React and React Native from the
 * example's node_modules only. Two copies of React in one bundle is the classic failure mode for
 * a linked library, and it shows up as "invalid hook call" rather than as a resolution error.
 */
const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
];
config.resolver.extraNodeModules = {
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react-native-safe-area-context': path.resolve(
    __dirname,
    'node_modules/react-native-safe-area-context',
  ),
};
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
