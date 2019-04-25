const path = require("path");
const webpack = require("webpack");
const CleanWepackPlugin = require("clean-webpack-plugin");
const config = require("../config");
// 项目名配置
const appName = {
  prefix: "profit",
  suffix: "center"
};

module.exports = {
  mode: "production",
  entry: {
    ant_icon: ["@ant-design/icons/lib/dist.js"]
  },
  output: {
    publicPath: `${config.test.assetsDllPath}`,
    path: path.resolve(__dirname, "../../", "dll"),
    filename: "[name].dll.js",
    library: "[name]_dll"
  },
  plugins: [
    new CleanWepackPlugin(["dll"], {
      root: path.join(__dirname, "../../")
    }),
    new webpack.DllPlugin({
      name: "[name]_dll",
      path: path.join(__dirname, "../../", "dll/[name].manifest.json")
    })
  ],
  performance: false
};
