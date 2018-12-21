const path = require('path');
const func = require('./func');

module.exports = {
    production: {
        appName: {
            prefix: 'bravo',
            suffix: 'stage'
        },
        assetsRoot: path.join(__dirname, '../../', 'dist'),
        assetsSubDictionary: '',
        assetsPublicPath: '/',
    },
    development: {
        host: func.getIPAdress() || 'localhost',
        appName: {
            prefix: 'bravo',
            suffix: 'stage'
        },
        assetsRoot: path.join(__dirname, '../../', 'dist'),
        assetsSubDictionary: '',
        assetsPublicPath: '/',
    },
    mock: {
        host: func.getIPAdress() || 'localhost',
        port: 3000,
    }
}