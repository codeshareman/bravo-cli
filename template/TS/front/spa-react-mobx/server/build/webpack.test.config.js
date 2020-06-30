const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const { resolve } = require("./utils");
const config = require("../config");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    publicPath: config.test.assetsPublicPath,
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: config.test.chunkFilename
  },
  plugins:[
    //new BundleAnalyzerPlugin()
  ]
});
