const path = require("path");
const webpack = require("webpack"); // Import webpack

module.exports = {
  // ... other configuration ...
  resolve: {
    fallback: {
      // Add this section
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
      tls: false,
      net: false,
    },
  },
  // ... other configuration
};
