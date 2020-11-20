const fs = require('fs')
const { resolve } = require('path')
const { EXTENTIONS } = require('../conf')
const fixPath = require('./fixPath')

const listFolderFiles = (path, audioFiles) => {
    return new Promise((resolve, reject) => {
        path = fixPath(path)
        fs.readdirSync(path).forEach(item => {
            const itemPath = fs.realpathSync(path + item)
            EXTENTIONS.forEach(ext => {
                if (itemPath.endsWith(ext))
                    audioFiles.push(itemPath)
            })
            if (fs.statSync(itemPath).isDirectory())
                listFolderFiles(itemPath, audioFiles).then( moreAudiofiles => { audioFiles.push(moreAudiofiles) })
        })
        resolve(audioFiles)
    })
}

module.exports = listFolderFiles