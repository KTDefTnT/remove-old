// 公共配置
// 需要安装的npm包
// npm install -D rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-alias @rollup/plugin-replace @rollup/plugin-eslint @rollup/plugin-babel rollup-plugin-terser rollup-plugin-clear @rollup/plugin-json
const { nodeResolve } = require("@rollup/plugin-node-resolve"); // 解析 node_modules 中的模块
const commonjs = require("@rollup/plugin-commonjs"); // cjs => esm
const alias = require("@rollup/plugin-alias"); // alias 和 reslove 功能
const replace = require("@rollup/plugin-replace");
const eslint = require("@rollup/plugin-eslint");
const { babel } = require("@rollup/plugin-babel");
const { terser } = require("rollup-plugin-terser");
const clear = require("rollup-plugin-clear");
const json = require("@rollup/plugin-json"); // 支持在源码中直接引入json文件，不影响下面的
const { readFileSync } = require("fs");
const { name, version, author } = JSON.parse(
  readFileSync("package.json", { encoding: "utf8" })
);

const pkgName = "remove-old-file";
// 打包处理的文件，添加的备注信息
const banner =
  "/*!\n" +
  ` * ${name} v${version}\n` +
  ` * (c) 2023-${new Date().getFullYear()} ${author}\n` +
  " * Released under the MIT License.\n" +
  " */";

module.exports = {
  input: "src/index.js",
  // 同时打包多种规范的产物
  output: [
    {
      // # UMD format requires a bundle name for browers and node
      file: `dist/${pkgName}.umd.js`,
      format: "umd",
      name: pkgName,
      banner,
    },
    {
      // # UMD format requires a bundle name for browers and node
      file: `dist/${pkgName}.umd.min.js`, // 打包后的文件名称
      format: "umd", // 打包后的模块格式
      name: pkgName, // 打包的名称
      banner, // A string to prepend/append to the bundle. footer是插入到文件后
      plugins: [terser()], // rollup打包后执行的插件，压缩文件
    },
    {
      // # compile to a CommonJS module ('cjs')  for node
      file: `dist/${pkgName}.cjs.js`,
      format: "cjs",
      name: pkgName,
      banner,
      plugins: [terser()],
    },
    {
      // # compile to a esModule
      file: `dist/${pkgName}.esm.js`,
      format: "es",
      name: pkgName,
      banner,
      plugins: [terser()],
    },
    {
      // # compile to a <script> containing a self-executing function ('iife')
      file: `dist/${pkgName}.js`,
      format: "iife",
      name: pkgName,
      banner,
      plugins: [terser()],
    },
  ],
  // 注意 plugin 的使用顺序
  plugins: [
    json(),
    clear({
      targets: ["dist"],
    }),
    alias(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      preventAssignment: true,
    }),
    nodeResolve(),
    commonjs({
      include: "node_modules/**",
    }),
    eslint({
      throwOnError: true, // 抛出异常并阻止打包
      include: ["src/**"],
      exclude: ["node_modules/**"],
    }),
    babel({ babelHelpers: "bundled" }),
  ],
};
