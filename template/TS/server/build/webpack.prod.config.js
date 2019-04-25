const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const config = require("../config");
const { resolve } = require("../config/func")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "production",
  //devtool: "source-map",
  entry: {
    main: "./src/index.tsx"
  },
  output: {
    publicPath: config.production.assetsPublicPath,
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: config.production.chunkFilename
  },
  plugins:[
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    runtimeChunk: {
      name: config.production.manifestName
    }
  }
});
