const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    transformer: {
        getTransformOptions: async () => ({
          transform: {
            // Tắt hỗ trợ import thử nghiệm để tránh xung đột
            experimentalImportSupport: false,
            // Cho phép trì hoãn require đến khi module được sử dụng,
            // giúp Worklet của Reanimated được đánh dấu đúng (_WORKLET)
            inlineRequires: true,
          },
        }),
      },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
