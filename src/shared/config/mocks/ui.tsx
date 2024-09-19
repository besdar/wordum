jest.mock('react-native-vector-icons', () => ({
  createMultiStyleIconSet: () => null,
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => ({
  default: () => null,
}));
