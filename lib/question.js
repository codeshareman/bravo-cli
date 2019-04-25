const question = {
  name: {
    type: "input",
    message: `项目名称: `,
    name: "name",
    default: "bravo-cli"
  },
  version: {
    type: "input",
    message: `初始版本: `,
    name: "version",
    default: "1.0.0"
  },
  package: {
    type: "list",
    message: "请选择包管理器？",
    name: "package",
    choices: ["yarn", "npm", "cnpm"]
  },
  extraPlugins: {
    type: "list",
    name: "extraPackage",
    message: "请选择你要安装的依赖包?",
    choices: ["voi"]
  },
  testTool: {
    type: "list",
    message: "请选择测试工具",
    name: "test_tool",
    choices: ["e2e", "jest", "karma"]
  },
  template: {
    type: "list",
    message: "请选择模版类型",
    name: "template",
    choices: ["TS", "JS"]
  }
};

exports = module.exports = question;
