jest.mock(
  'react-native/Libraries/PermissionsAndroid/PermissionsAndroid',
  () => {
    const PermissionsAndroid = jest.requireActual(
      'react-native/Libraries/PermissionsAndroid/PermissionsAndroid',
    );

    return {
      default: {
        check: jest.fn(() => Promise.resolve(true)),
        request: jest.fn(() =>
          Promise.resolve(PermissionsAndroid.RESULTS.GRANTED),
        ),
        PERMISSIONS: PermissionsAndroid.default.PERMISSIONS,
        RESULTS: PermissionsAndroid.default.RESULTS,
      },
    };
  },
);
