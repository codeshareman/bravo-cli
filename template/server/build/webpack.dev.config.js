const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = require('../config');

function resolve(dir) {
  return path.join(__dirname, "../../", dir);
}

// 项目名配置
const appName = config.development.appName

module.exports = {
  mode: "development",
  entry: {
    // 'reacts': ['react', 'react-dom', 'react-router-dom', 'react-router'],
    [`${appName.prefix}_main`]: "./src/index.js"
  },
  output: {
    publicPath:  `http://${config.development.host}:9002/`,
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js"
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
  devServer: {
    host: config.development.host,
    historyApiFallback: {
      disabledDotRule: true
    },
    compress: true,
    port: 9002,
    proxy: {
      "/api": {
        target: "http://wws.test.ximalaya.com/wws-b/v2/api/",
        pathRewrite: { "^/api": "" },
        changeOrigin: false,
        secure: false
      },
      "/mock": {
        target: `http://${config.development.host}:3000/`,
        pathRewrite: { "^/mock": "" },
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimization: {
    runtimeChunk: {
      name: `manifest-${appName.prefix}`
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
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
