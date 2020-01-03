# Merchant-b

商户平台 后台工程

### 项目结构

```
|—— public
|   |—— favicon.ico      标签栏图标
|   |—— index.html       html模版文件
|—— server
|   |—— build            webpack工程构建目录
|   |    |——build.js     构建入口文件
|   |    |——...          ...
|   |—— config           打包配置文件
|—— src
|   |—— api              项目公共api
|   |    |—— axios.ts    axios 实例 (都引入这个)
|   |    |—— config.ts   baseUrl 配置
|   |    |—— index.ts    公共API 入口
|   |—— assests          全局资源
|   |    |—— css         全局样式
|   |    |—— icons       全局图标
|   |    |—— images      全局图片
|   |—— components       公共业务组件
|   |—— declare          全局类型申明文件
|   |—— layout           页面布局文件
|   |—— pages            页面文件（按模块划分、总文件夹层级不超过3级）
|   |    |—— api        （非通用）模块api
|   |    |—— css        （非通用）模块样式
|   |    |—— ...         tsx 文件
|   |—— router           路由文件
|   |    |—— config.ts   页面路由配置
|   |    |—— loadPage.ts 页面配置
|   |    |—— utils.tsx   路由相关工具函数
|   |    |—— index.tsx   主路由入口
|   |—— shared           通用工具库
|   |    |—— common
|   |    |   |—— constants.ts     通用常量
|   |    |   |—— regex.ts         通用正则
|   |    |   |—— utils.ts         通用函数
|   |    |   |—— verify.ts        通用表单验证规则
|   |—— App.tsx
|   |—— index.tsx        项目入口文件
|   |—— index.scss       项目入口文件样式
|—— static               静态资源文件(html等)
|—— .babelrc             babel 配置
|—— .gitignore           git忽略文件
|—— package.json
|—— tslint.json

```

#### 本地启动方式

```
yarn start
```

#### 构建命令

```
// test
yarn build-test

// uat
yarn build-uat

// prod
yarn build-prod

```
