// config-overrides.js
const { addWebpackAlias } = require("customize-cra");
const path = require("path"); // Import the 'path' module

module.exports = function override(config, env) {
  config = addWebpackAlias({
    "@src": path.resolve(__dirname, "src"),
    "@data": path.resolve(__dirname, "src/_data"),

    "@assets": path.resolve(__dirname, "src/assets"),
    "@images": path.resolve(__dirname, "src/assets/images"),

    "@components": path.resolve(__dirname, "src/components"),
    "@contexts": path.resolve(__dirname, "src/contexts"),
    "@contest": path.resolve(__dirname, "src/contest"),

    "@layouts": path.resolve(__dirname, "src/layouts"),
    "@webRouting": path.resolve(__dirname, "src/webRouting"),
    "@middleware": path.resolve(__dirname, "src/middleware"),

    "@pages": path.resolve(__dirname, "src/pages"),
    // Add more aliases as needed
  })(config);

  return config;
};
