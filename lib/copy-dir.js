const path = require("path");
const fs = require("fs");
const statSync = fs.statSync;
const mkdirSync = fs.mkdirSync;

// 拷贝模版文件
function copyDir(fromSrc, toSrc) {
  return new Promise((resolve) => {
    const basename = path.parse(fromSrc).name;
    function copyFile(fromSrc, toSrc) {
      const stat = fs.statSync(fromSrc);
      if (stat.isFile()) {
        const newFileName = path.parse(fromSrc).base;
        const readStream = fs.createReadStream(fromSrc, {
          encoding: "utf-8"
        });
        const writeStream = fs.createWriteStream(path.join(toSrc, newFileName));
        readStream.pipe(writeStream);
      } else if (stat.isDirectory()) {
        const dirname = path.parse(fromSrc).name;
        let childName = "";
        if (dirname !== basename) {
          childName = path.join(toSrc, dirname);
        } else {
          childName = toSrc;
        }
        if(!fs.existsSync(childName)) {
            mkdirSync(childName);
        }
        const files = fs.readdirSync(fromSrc, {
          encoding: "utf-8"
        });
  
        files.map(file => {
          const _fromSrc = `${fromSrc}/${file}`;
          const _toSrc = childName;
          copyFile(_fromSrc, _toSrc);
        });
      }
    }
    copyFile(fromSrc, toSrc);
    resolve();
  });
}

exports = module.exports = copyDir;
