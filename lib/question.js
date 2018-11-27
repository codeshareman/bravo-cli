const question = {
    name: {
        type: 'input',
        message: `项目名称: `,
        name: 'name',
        default: 'broccoli-stage'
    },
    version: {
        type: 'input',
        message: `初始版本: `,
        name: 'version',
        default: '1.0.0'
    },
    package: {
        type: 'list',
        message: '请选择包管理器？',
        name: 'package',
        choices: ['yarn', 'npm', 'cnpm']
    },
    testTool: {
        type: 'list',
        message: '请选择测试工具',
        name: 'test_tool',
        choices: ['e2e', 'jest', 'karma']     
    }
}


exports = module.exports = question;
