const cmd = require("node-cmd");
const os = require("os");

function nodeCmd(arr, spinner, installTips) {
  return new Promise((resolve, reject) => {
    let cmdStr = "";
    // windows系统
    if (os.type() === "Windows_NT") {
      arr.forEach((item, index) => {
        index === 0 ? (cmdStr += item) : (cmdStr = cmdStr + " & " + item);
      });
    // 非windows系统
    } else {
      arr.forEach((item, index) => {
        index === 0 ? (cmdStr += item) : (cmdStr += "\n" + item);
      });
    }
    let processRef = cmd.get(cmdStr, function(err, data, stderr) {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
    let watch_line = installTips + "\n";
    processRef.stdout.on("data", function(data) {
      watch_line += data;
      spinner.start(watch_line);
    });
  });
}

exports = module.exports = nodeCmd;
