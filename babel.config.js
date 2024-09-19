module.exports = {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
