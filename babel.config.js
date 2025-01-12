module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add the Expo Router plugin
      'expo-router/babel',
      // Then NativeWind
      // 'nativewind/babel',
    ],
  };
};
