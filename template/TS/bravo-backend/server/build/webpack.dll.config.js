const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: ['react', 'react-dom', 'moment'],
  output: {
    filename: 'react.dll.js',
    path: path.resolve('dll'),
    library: 'react',
  },

  plugins: [
    new webpack.DllPlugin({
      name: 'react',
      path: path.resolve('dll', 'manifest.json'),
    }),
  ],
}
