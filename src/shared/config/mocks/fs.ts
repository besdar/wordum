const mockCreate = jest.fn();
const mockWrite = jest.fn();
const mockText = jest.fn();

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation((...pathParts) => ({
    uri: pathParts
      .map(part => (typeof part === 'string' ? part : part.uri))
      .join('/'),
    create: mockCreate,
    write: mockWrite,
    text: mockText,
  })),
  Paths: {
    cache: {uri: 'file:///mock/cache'},
  },
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));
