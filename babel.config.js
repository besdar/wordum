module.exports = {
  presets: ['babel-preset-expo', '@babel/preset-typescript'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
