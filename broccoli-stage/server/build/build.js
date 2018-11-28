const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const rf = require('rimraf')
const webpack = require('webpack');
const configs = require('../config');
const env =  process.env.APP_ENV;
const webpackConfig =
  process.env.APP_ENV === "production"
    ? require("./webpack.prod.config")
    : require("./webpack.dev.config");

const spinner = ora('Build For ' + process.env.APP_ENV);
spinner.color = 'yellow';
spinner.start();

rf(path.join(configs[env].assetsRoot, configs[env].assetsSubDictionary), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
})
