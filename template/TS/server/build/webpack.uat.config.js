const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const { resolve } = require("../config/func");
const config = require("../config");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  entry: {
    main: "./src/index.tsx"
  },
  output: {
    publicPath: config.uat.assetsPublicPath,
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: config.uat.chunkFilename
  },
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    runtimeChunk: {
      name: config.uat.manifestName
    }
  }
});
