//import { resultWarpper }  from "../utils.js"
const resultWarpper = require("../utils")
const dashboard = require("./dashboard");

//post请求路由
const routes = {
  "/wws-dashboard/lib": resultWarpper(dashboard.lib),
};

module.exports = url => sroutes[url];
