const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWepackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const config = require("../config");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, "../../", dir);
}

// 项目名配置
const appName = config.production.appName;

module.exports = {
  mode: "production",
  entry: {
    //   reacts: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    //   biz_charts: ['bizcharts'],
    //   ant_icon: ['@ant-design/icons/lib/dist.js'],
    main: "./src/index.js"
  },
  output: {
    publicPath:
      process.env.APP_ENV === "production"
        ? `//s1.xmcdn.com/lib/${appName.prefix}-${appName.suffix}/last/dist/`
        : `http://static2.pp.ximalaya.com/lib/${appName.prefix}-${
            appName.suffix
          }/last/dist/`,
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: `js/${appName.prefix}_[name].js?v=[hash:8]`
  },
  resolve: {
    alias: {
      "@SRC": resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        include: [
          path.join(__dirname, "../../src"),
          path.join(__dirname, "../../node_modules/@xmly")
        ],
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
      name: `manifest-${appName.prefix}`
    },
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: false
      // cacheGroups: {
      //   vendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10
      //   },
      //   default: {
      //     minChunks: 2,
      //     priority: -20,
      //     reuseExistingChunk: true
      //   }
      // }
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
    ]
    // splitChunks: {
    //     chunks: 'initial',
    // },
  },
  plugins: [
    // new webpack.NamedChunksPlugin(),
    // new webpack.NamedModulesPlugin(),
    new CleanWepackPlugin(["dist"], {
      root: path.join(__dirname, "../../")
    }),
    new CopyWebpackPlugin([
      {
        from: resolve("static"),
        to: "static"
      }
    ]),
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
