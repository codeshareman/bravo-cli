## Bravo Stage


### 安装使用方式

```
    git clone git@gitlab.ximalaya.com:codeshareman/broccoli-stage.git
    yarn install

    ==== 本地运行 ====
    yarn start 

    ==== 构建项目 ====
    
    // 测试环境
    yarn run build:test
    
    // 生产环境
    yarn run build:prod

    // 启动mock数据服务
    yarn run mock

    ===== 发布项目（发布前请先构建项目）=====

    // 测试环境
    yarn run xpm3:test

    // 生产环境
    yarn run xpm3:prod

```

### 目录结构

```
---- server 目录 ----

+ build:                 
| webpack.dev.config.js  开发环境打包配置
| webpack.dll.config.js  动态链接库打包配置
| webpack.prod.config.js 生产环境打包配置
| build.js               webpack打包根文件
+ config
| func.js                server配置文件以来函数库
| index.js               server配置文件入口
+ mock                   mock服务
| ...

----  src  目录  ----

+ api:
| + request              业务API请求
| base.js                axios初始化配置
| common.js              公共API
| index.js               api入口文件（汇总业务和公共API）
+ assets                 项目资源文件
| images
| css
| ...
+ components             业务组件库（组件均为目录并且首字母大写）
| ...
+ configs                项目配置文件
| component.config.js    loadable懒加载组件
| router.config.js       项目路由文件（component.config.js 和 router.config.js 对应）
+ mock                   项目mock.json文件
+ pages
| [项目名]
| + UI                   页面UI布局等
| | index.js
| | index.scss           页面UI样式
| Container.js           页面container
| index.js               页面入口文件
+ routes
| [路由页面].js           路由文件【多级】  
+ store 
| + model                redux 模型(index.js为入口)
| + saga                 redux-saga(请求走saga管理)
+ utils                  工具函数库
+ test                   项目测试文件（待完善）
+ index.js               客户端项目入口文件 webpack打包入口

---- static 目录 ----

+ static                 项目静态文件 webpack【copy】
| + assets
| + index.html

```


     
     

