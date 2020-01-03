#!/usr/bin/env node
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const program = require('commander');
const download = require('download-git-repo');
const cmd = require('node-cmd');
const package = require('../package.json');
const question = require('../lib/question');
const nodeCmd = require('../lib/node-cmd');
const clearConsole = require('../lib/clear-console');
const copyDir = require('../lib/copy-dir');
const spinner = new ora();
// 配置参数
const configs = {
  spinner,
  anwsers: {},
};

program
  .version(package.version)
  .option('-c, --create', '初始化bravo-cli项目')
  .parse(process.argv);

// 清空控制台
function start() {
  return new Promise((resolve, reject) => {
    clearConsole('blue', '\n-------------------- bravo-cli --------------------\n');
    resolve();
  });
}

// 初始化项目选项
function initQuestion() {
  return new Promise(resolve => {
    inquirer
      .prompt([
        question.name,
        question.package,
        question.templateType,
        question.template,
        question.version,
      ])
      .then(result => {
        configs.anwsers.name = result.name;
        configs.anwsers.package = result.package;
        configs.anwsers.version = result.version;
        configs.anwsers.templateType = result.templateType;
        configs.anwsers.template = result.template;
        resolve();
      });
  });
}

// 检出项目到指定目录--git
function downloadProject() {
  return new Promise((resolve, reject) => {
    spinner.start('正在下载项目模版...');
    download('codeshareman/broccoli-codeshareman', configs.anwsers.name, function(err) {
      if (!err) {
        spinner.stop();
        resolve();
      }
    });
  });
}

// 拷贝模版文件
function copyTemplate() {
  const templateDir = configs.anwsers.templateType === 'TS' ? 'TS' : 'JS';
  const templateName = configs.anwsers.template;
  return new Promise((resolve, reject) => {
    spinner.start('正在拷贝模版到你的项目');
    const fromSrc = path.join(path.join(__dirname, `../template/${templateDir}/${templateName}`));
    const toSrc = path.join(process.cwd(), `/${configs.anwsers.name}`);
    copyDir(fromSrc, toSrc).then(res => {
      spinner.succeed('模版创建成功');
      resolve();
    });
  });
}

// 安装项目依赖
function installDependence() {
  return new Promise((resolve, reject) => {
    let installCmd = 'yarn install';
    const installType = configs.anwsers.package;
    const installTips = `正在安装 ${configs.anwsers.name} 的依赖包...`;
    switch (installType) {
      case 'yarn':
        installCmd = 'yarn install';
        break;
      case 'npm':
        installCmd = 'npm install';
        break;
      case 'cnpm':
        installCmd = 'cnpm install';
        break;
      default:
        installCmd = 'yarn install';
        break;
    }
    nodeCmd([`cd ${configs.anwsers.name}`, installCmd], spinner, installTips).then(res => {
      spinner.succeed(['项目依赖安装完成.']);
      spinner.clear();
      resolve();
    });
  });
}

// 安装其他插件
async function installExtraPlugin() {
  return new Promise((resolve, reject) => {
    inquirer.prompt(question.extraPlugins).then(result => {
      configs.anwsers.extraPlugins = result.extraPlugins;
      const installTips = `正在安装${result.extraPackage}...`;
      spinner.start(installTips);
      cmd.get(
        `
          nrm use xnpm
          cd ${configs.anwsers.name}
          npm i @xmly/voi --save
        `,
      ),
        (err, data, stderr) => {
          if (!err) {
            spinner.succeed([`项目插件${result.extraPackage}安装完成.`]);
            spinner.clear();
            resolve();
          } else {
            spinner.succeed([`项目插件${result.extraPackage}安装失败.`]);
          }
        };
    });
  });
}

async function initialize() {
  await start();
  await initQuestion();
  await copyTemplate();
  // await downloadProject();
  await installDependence();
  // await installExtraPlugin();
}

initialize();
