const path = require("path");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(
  path.join(__dirname, "../../src/mock", "db.json")
); 
const mockData = require(path.join(__dirname, "../../src/mock", "db.json"));

// mock配置文件
const config = require('../config');
const rules = require(path.join(__dirname, "../../src/mock", "rules.js"));
const rewriter = jsonServer.rewriter(rules); // 路由重写
const middlewares = jsonServer.defaults();
const { host, port} = config.mock;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {

  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  res.writeHead(200, {
    'content-type': 'application/json;charset=UTF-8'
  })
  res.end(JSON.stringify({
    code: 200,
    msg: '请求成功!',
    data: mockData.getProfitData
  }))

});
server.get('/mock/getProfitData', function(req,res) {
  console.log(12321);
})

// Use default router
server.use(rewriter)
server.use(router);


server.listen(port, host, () => {
  console.log(`mock地址: http://${host}:${port}`)
  console.log("JSON Server is running");
});

