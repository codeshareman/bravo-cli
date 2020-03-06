const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const tsImportPluginFactory = require('ts-import-plugin')

const { resolve } = require('./utils')
const config = require('../config')

module.exports = {
  entry: {
    main: './src/index.tsx',
  },

  // externals: {
  //   react: 'react',
  //   reactDom: 'react-dom',
  // },

  resolve: {
    alias: {
      '@': resolve('src'),
      '@ant-design/icons/lib/dist$': resolve('src/assets/icons/index'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'lib',
                    style: true,
                  }),
                ],
              }),
              compilerOptions: {
                module: 'es2015',
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: config.theme,
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024, //10kb 以上的图片不打包
              name: 'images/[name]-[hash:8].[ext]',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
              name: './fonts/[name]-[hash:8].[ext]',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css',
    }),
    new HtmlWebpackPlugin({
      path: resolve('dist'),
      template: resolve('public/index.html'),
      filename: 'index.html',
      favicon: resolve('public/favicon.ico'),
      minify: true,
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    new webpack.ContextReplacementPlugin(/validatorjs(\/src\/)lang$/, /zh.js$/),
  ],
  performance: false,
}
