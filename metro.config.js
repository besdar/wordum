const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blacklistRE: /node_modules\/jsdom\/.*/,
    extraNodeModules: {
      jsdom: require.resolve('./emptyModule.js'),
    }
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
