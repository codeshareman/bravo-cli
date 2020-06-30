const common = require("./common");
const cart = require("./cart");
const account = require("./account");

module.exports = {
  ...common,
  ...cart,
  ...account
};
