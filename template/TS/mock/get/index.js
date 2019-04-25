const common = require("./common");
const dashboard = require("./dashboard");
const scanPlay = require("./scanPlay");

module.exports = {
  ...common,
  ...dashboard,
  ...scanPlay
};
