const question = {
  name: {
    type: "input",
    message: `项目名称: `,
    name: "name",
    default: "bravo-cli",
  },
  version: {
    type: "input",
    message: `初始版本: `,
    name: "version",
    default: "1.0.0",
  },
  package: {
    type: "list",
    message: "请选择包管理器？",
    name: "package",
    choices: ["yarn", "npm", "cnpm"],
  },
  extraPlugins: {
    type: "list",
    name: "extraPackage",
    message: "请选择你要安装的依赖包?",
    choices: ["voi"],
  },
  testTool: {
    type: "list",
    message: "请选择测试工具",
    name: "test_tool",
    choices: ["e2e", "jest", "karma"],
  },
  templateType: {
    type: "list",
    message: "请选择模版类型",
    name: "templateType",
    choices: ["TS"],
  },
  templateCate: {
    type: "rawlist",
    name: "templateCate",
    message: "请选择模版类别",
    choices: ["front", "backend"],
  },
  template: {
    type: "rawlist",
    message: "请选择模版",
    name: "template",
    choices: ({ templateCate }) => {
      const backendTemplates = ["spa-react-cra", "spa-react-mobx"];
      const frontTemplates = ["spa-react-cra"];
      return "backend" === templateCate ? backendTemplates : frontTemplates;
    },
  },
};

exports = module.exports = question;
