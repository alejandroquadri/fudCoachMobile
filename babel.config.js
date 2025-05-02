module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@api': './api',
            '@components': './components',
            '@hooks': './hooks',
            '@navigation': './navigation',
            '@services': './services',
            '@screens': './screens',
            '@theme': './theme',
            '@types': './types',
            '@utils': './utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
