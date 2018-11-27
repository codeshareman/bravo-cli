const chalk = require('chalk');
const readline = require('readline');

function clearConsole() {
    const color = arguments[0] || 'blue';
    const text = arguments[1] || '';
    if(process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }
    console.info(chalk[color](text))
}

exports = module.exports = clearConsole;