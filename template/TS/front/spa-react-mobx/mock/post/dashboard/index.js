const Mock = require("mockjs");

const allIndexMap = () =>
  Mock.mock({
    "indexMap|5-12": [
      {
        growthRate: () => +Mock.Random.float(-1, 1).toFixed(2),
        indexName: () => Mock.Random.ctitle(3, 5),
        indexValue: () => Mock.Random.integer(1, 50000)
      }
    ]
  });

const lib = allIndexMap().indexMap;

module.exports = {
  lib
};
