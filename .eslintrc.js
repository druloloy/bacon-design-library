/**
 * Bacon Design System — lint configuration.
 *
 * Beyond ordinary code hygiene this config carries three *brand* rules. They exist because
 * the Brand Guide (13 — Misuse) treats a one-off colour, weight or radius introduced on a
 * single screen as "a fork of the system". Lint is the cheapest place to stop that.
 */
const BRAND_RULES = [
  {
    selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
    message:
      'Raw hex colours are not allowed. Every colour lives in src/foundations/colors.ts. ' +
      'Import it from the theme (useBaconTheme) or from `baconColors`.',
  },
  {
    selector:
      "Property[key.name='fontWeight'][value.value='600'], Property[key.name='fontWeight'][value.value=600]",
    message:
      'Quicksand 600 is not part of the Bacon type system. The identity depends on the gap ' +
      'between Light (300) and Bold (700) — see Brand Guide 05.',
  },
  {
    selector: "Property[key.name='fontFamily']",
    message:
      'Do not set fontFamily directly. Use <BaconText variant="..."> so Quicksand and its ' +
      'fallback stack resolve consistently across platforms (Brand Guide 05).',
  },
];

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  env: { es2022: true, node: true },
  globals: { __DEV__: 'readonly', JSX: 'readonly' },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: { react: { version: '18.2' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
  },
  overrides: [
    {
      // Brand rules apply to component source only.
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      excludedFiles: ['src/foundations/**'],
      rules: { 'no-restricted-syntax': ['error', ...BRAND_RULES] },
    },
    {
      files: ['tests/**/*.ts', 'tests/**/*.tsx', 'stories/**/*.tsx'],
      env: { jest: true },
      globals: { __DEV__: 'readonly' },
      rules: { '@typescript-eslint/no-explicit-any': 'off', 'no-console': 'off' },
    },
  ],
  ignorePatterns: [
    'lib/',
    'node_modules/',
    'coverage/',
    'example/node_modules/',
    '*.config.js',
    '.eslintrc.js',
  ],
};
