// npm install -D rollup-plugin-filesize
const baseConfig = require("./rollup.config.base.js");
const filesize = require("rollup-plugin-filesize");

module.exports = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, filesize()],
};
