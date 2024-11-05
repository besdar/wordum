jest.mock('react-native-sound-player', () => ({
  playSoundFile: jest.fn(),
}));

jest.mock('react-native-tts', () => ({
  voices: jest.fn(),
  requestInstallData: jest.fn(),
  getInitStatus: jest.fn(),
  setDefaultLanguage: jest.fn(),
  requestInstallEngine: jest.fn(),
}));
