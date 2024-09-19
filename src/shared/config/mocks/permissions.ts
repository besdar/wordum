jest.mock(
  'react-native/Libraries/PermissionsAndroid/PermissionsAndroid',
  () => {
    const PermissionsAndroid = jest.requireActual(
      'react-native/Libraries/PermissionsAndroid/PermissionsAndroid',
    );

    return {
      ...PermissionsAndroid,
      check: jest.fn(() => Promise.resolve(true)),
      request: jest.fn(() =>
        Promise.resolve(PermissionsAndroid.RESULTS.GRANTED),
      ),
    };
  },
);
