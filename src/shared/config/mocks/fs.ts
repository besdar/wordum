jest.mock('@dr.pogodin/react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/path',
  downloadFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
}));
