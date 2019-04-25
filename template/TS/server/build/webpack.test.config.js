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
    //[config.test.mainEntryKey]: "./src/index.tsx"
    main: "./src/index.tsx"
  },
  output: {
    publicPath: config.test.assetsPublicPath,
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: config.test.chunkFilename
  },
  plugins:[
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    runtimeChunk: {
      name: config.test.manifestName
    }
  }
});
