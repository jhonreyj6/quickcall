const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
let finalConfig = config;

try {
  const { withNativeWind } = require('nativewind/metro');
  finalConfig = withNativeWind(config, { input: './global.css' });
} catch (e) {
  console.warn('nativewind/metro failed to load; exporting default Metro config. error:', e && e.message);
}

module.exports = finalConfig;


