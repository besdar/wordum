module.exports = {
  preset: 'react-native',
  setupFiles: [
    './src/shared/config/mocks/lang.ts',
    './src/shared/config/mocks/async-storage.ts',
    './src/shared/config/mocks/permissions.ts',
    './src/shared/config/mocks/fs.ts',
    './src/shared/config/mocks/fsrs.ts',
    './src/shared/config/mocks/react-native-modules.ts',
    './src/shared/config/mocks/ui.tsx',
    './src/shared/config/mocks/navigator.ts',
    './src/shared/config/mocks/eventBus.ts',
    './src/shared/config/mocks/sound.ts',
  ],
  setupFilesAfterEnv: ['./src/shared/config/mocks/jest-setup.ts'],
  fakeTimers: {
    enableGlobally: true,
  },
  resetMocks: true,
};
