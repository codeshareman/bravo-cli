const fs = require('fs');
const path = require('path');

function fileFunc() {
    const isExist = fs.existsSync('package.json');
    const current_version = '0.1.0';
    const writeOptions = {
        encoding: 'utf-8',
        flag: 'w+'
    }
    if(isExist) {
        fs.readFile('package.json', 'utf-8', function(err, data) {
            data = JSON.parse(data);
            data.version = current_version;
            fs.writeFile('package.json', JSON.stringify(data), writeOptions, function(err) {
                if(err) console.log(err);
            })
        }); 
    }
}
exports = module.exports = fileFunc;