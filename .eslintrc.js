module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      // Test files only
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
