const songCollection = require('../models/songSchema')
const listFolderFiles = require('../core/listFolderFiles')
const { PATH } = require('../conf')
const md5File = require('md5-file')
const Song = require('../models/Song')

const getAll = (request, response) => {
    songCollection.find((error, songs) => {
        if (error)
            return response.status(500).send(error)
        return response.status(200).send(songs)
    })
}

const updateDatabase = (request, response) => {
    const filePaths = listFolderFiles(PATH)
    filePaths.forEach(file => {
        songCollection.findById(md5File.sync(file), (error, song) => {
            if (error)
                console.log(error)
            if (!song) {
                const saveSong = async (file) => {
                    const songObj = new Song(file)
                    await songObj.fillWithMetadata()
                    new songCollection(songObj)
                        .save((error) => {
                            if (error)
                                console.error(error)
                        })
                }
                saveSong(file)
            } else {
                if (song.filepath != file) {
                    songCollection.findByIdAndUpdate(song.id, { "filepath": file }, (error) => {
                        if (error)
                            console.error(error)
                    })
                }
            }
        })
    })
    return response.status(200).send({
        "message": "Database updated."
    })
}

module.exports = {
    getAll,
    updateDatabase
}