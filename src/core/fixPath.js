const os = require('os')
const fs = require('fs')

const fixPath = (path) => {
    let bar
    switch(os.platform()) {
        case 'win32':
            bar = "\\"
            break;
        case 'linux':
            bar = "/"
            break;
    }
    path = fs.realpathSync(path) + bar
    return path
}

module.exports = fixPath