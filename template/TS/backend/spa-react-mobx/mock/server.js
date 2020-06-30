const path = require("path");
const resolve = file => path.resolve(__dirname, "./", file);
const jsonServer = require("json-server");
const config = require("../server/config");
const { host, port } = config.mock;
const rules = require(resolve("rules.js"));
const getData = require("./get");
const postData = require("./post");

// mock配置文件
const server = jsonServer.create();
const rewriter = jsonServer.rewriter(rules); // 路由重写
const middlewares = jsonServer.defaults();
const router = jsonServer.router(getData);

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "POST") {
    res.status(200).jsonp(postData(req.url));
  } else {
    next();
  }
});

server.use(rewriter);
server.use(router);

server.listen(port, host, () => {
  console.log(`mock地址: http://${host}:${port}`);
  console.log("JSON Server is running");
});
