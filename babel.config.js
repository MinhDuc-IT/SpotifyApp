module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ...các plugin khác
    'react-native-reanimated/plugin', // phải là plugin cuối cùng
  ],
};
