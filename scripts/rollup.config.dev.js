// npm install -D rollup-plugin-serve rollup-plugin-livereload
const baseConfig = require("./rollup.config.base.js");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");

module.exports = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    serve({
      port: 8080,
      contentBase: ["dist", "examples/brower"],
      openPage: "index.html",
    }),
    livereload({
      watch: "examples/brower",
    }),
  ],
};
