jest.mock('expo-speech', () => {
  return {
    speak: jest.fn(),
  };
});
