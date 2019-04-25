## 万物声B端前台模版

### 项目结构

```
├── mock                    mock数据
|   ├── get                 get请求参数
|   ├── post                非get请求
|   ├── rules.js            get请求路由
|   ├── server.js           启动mock服务的js
├── server                  打包相关
|   ├── build               打包相关文件
|   ├── config              配置信息
├── src                     src目录
|   ├── api                 api
|   ├── assets              静态资源
|   ├── components          公共组件
|   ├── configs             配置信息
|   ├── declare             声明文件
|   ├── HOC                 高阶组件
|   ├── icons               icon图片
|   ├── layout              layout
|   ├── pages               页面组件
|   ├── routes              路由配置
|   ├── store               store
|   ├── utils               公共类
|   └── index.tsx           入口文件
├── static 
├── .babelrc 
├── .gitignore 
├── application.config.json 
├── tsconfig.json 
├── tslint.json                 
└── package.json

```


### 访问路径

#### 本地调试

启动命令:  `yarn start`

默认访问路径后缀: `/wws-workbench/v1/template `

#### 打包

* 测试环境  
`   yarn build:test 
    xpm3 pp
`

* 正式环境  
`
    yarn build:prod  
    xpm3 pe
`

正式环境提交后 需审核

#### MOCK

启动命令: 
`yarn mock`

mock数据可以选择使用mock.js 

#### 注意事项

 > @xmly/voi 在喜马的库中, 安装时需切换到自己的库
