const fs = require('fs')
const { EXTENTIONS } = require('../conf')
const fixPath = require('./fixPath')

const listFolderFiles = (path, callback) => {
    path = fixPath(path)
    fs.readdirSync(path).forEach(item => {
        const itemPath = fs.realpathSync(path + item)
        EXTENTIONS.forEach(ext => {
            if (itemPath.endsWith(ext))
                callback(itemPath)
        })
        if (fs.statSync(itemPath).isDirectory())
            listFolderFiles(itemPath, callback)
    })
}

module.exports = listFolderFiles