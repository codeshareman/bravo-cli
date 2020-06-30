const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');

const isDevelopment = process.env.NODE_ENV === 'development';

const overrideFn = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  }),
  addWebpackAlias({
    'react-redux': process.env.NODE_ENV === 'development' ? 'react-redux/lib' : 'react-redux'
  })
);

// const addProxy = (config) => {
//   config.proxy =  {
//     '/api/v1': {
//       target: 'https://www.v2ex.com',
//       changeOrigin: true,
//       pathRewrite: { '^/v2ex': '/' },
//   },
//   }
// }

module.exports = function(...args) {
  const webpackConfig = overrideFn(...args);
  webpackConfig.optimization.chunkIds = 'named';
  webpackConfig.optimization.moduleIds = 'hashed';

  if (isDevelopment) {
    // 开发环境修改cheap-module-source-map => cheap-module-eval-source-map
    webpackConfig.devtool = 'cheap-module-eval-source-map';
  }
  return webpackConfig;
};
