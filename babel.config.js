module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@sdk': './src/sdk',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@types': './src/types',
            '@utils': './src/utils',
            '@services': './src/services',
            '@store': './src/store'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
