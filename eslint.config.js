const {FlatCompat} = require('@eslint/eslintrc');
const js = require('@eslint/js');
const reactNativeConfig = require('@react-native/eslint-config/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const testingLibrary = require('eslint-plugin-testing-library');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: ['node_modules/**', 'android/**', 'ios/**'],
  },
  ...compat.extends('@feature-sliced'),
  js.configs.recommended,
  ...reactNativeConfig,
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/no-await-sync-events': 'off',
    },
  },
  prettierRecommended,
];
