const path = require('path');

module.exports = {
    production: {
        assetsRoot: path.join(__dirname, '../../', 'dist'),
        assetsSubDictionary: '',
        assetsPublicPath: '/',
    },
    development: {
        assetsRoot: path.join(__dirname, '../../', 'dist'),
        assetsSubDictionary: '',
        assetsPublicPath: '/',
    }
}