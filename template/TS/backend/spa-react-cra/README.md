This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [Cra-Template-Tianrang](http://git.tianrang-inc.com/ipa/fed/cra-template-tianrang).

## 环境需求

- git >= `2.13.0`

## 代码规范

- .eslinttrc.js(继承自 react-app，在 cra 内部的配置基础上做了些改动)

<!-- ## 提交规范

> git commit 时会对 message 格式做校验

- [conventional commits](https://www.conventionalcommits.org/)('build', 'ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test') -->

## 项目结构

> 自研组件遵循`Atomic Design`模式。

- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Extending Atomic Design](https://bradfrost.com/blog/post/extending-atomic-design/)

### 状态管理方案

> 目前项目中使用`redux`+`@reduxjs/toolkit`作为全局状态管理的方案，toolkit 可以极大程度上解决模板代码的问题，除此之外还结合微软的`redux-dynamic-modules`做代码分割。

- [状态管理方案的思考](https://www.tapd.cn/55128786/documents/show/1155128786001001583)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
