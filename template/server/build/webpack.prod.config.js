const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWepackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, "../../", dir);
}
module.exports = {
  mode: "production",
  entry: {
    "main-broccoli": "./src/index.js"
  },
  output: {
    // publicPath: '/',
    publicPath: "http://static2.pp.ximalaya.com/lib/broccoli-stage/last/dist/",
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js"
  },
  resolve: {
    alias: {
      "@": resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          "css-loader",
          {
            loader: "less-loader",
            options: { javascriptEnabled: true }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [
          {
            loader: "url-loader"
          }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 50000,
              name: "./fonts/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: "manifest-broccoli"
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false
      })
    ],
    // splitChunks: {
    //     chunks: 'initial',
    // },
    runtimeChunk: {
      name: "manifest-broccoli"
    }
  },
  plugins: [
    new CleanWepackPlugin(["dist"], {
      root: path.join(__dirname, "../../")
    }),
    new CopyWebpackPlugin([
      {
        from: resolve("static"),
        to: 'static'
      }
    ]),
    // new BundleAnalyzerPlugin(),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../../", "dll/reacts.manifest.json")
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(
        __dirname,
        "../../",
        "dll/biz_charts.manifest.json"
      )
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../../", "dll/ant_icon.manifest.json")
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].css"
    }),
    new HtmlWebpackPlugin({
      path: path.resolve(__dirname, "./dist"),
      template: path.resolve(__dirname, "../../", "index.html"),
      filename: "index.html",
      minify: true
    })
  ],
  devtool: "source-map",
  performance: false
};
