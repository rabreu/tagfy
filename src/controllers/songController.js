const songCollection = require('../models/songSchema')
const Song = require('../models/Song')
const listFolderFiles = require('../core/listFolderFiles')
const { PATH } = require('../conf')
const md5File = require('md5-file')
const fs = require('fs')

const getAll = (request, response) => {
    songCollection.find((error, songs) => {
        if (error)
            return response.status(500).send(error)
        return response.status(200).send(songs)
    })
}

const updateDatabase = (request, response) => {
    listFolderFiles(PATH, (file) => {
        const id = md5File.sync(file)
        console.log(`${id} ${file}`)
        songCollection.findById(id, (error, song) => {
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
                    songCollection.findByIdAndUpdate(song._id, { "filepath": file }, (error) => {
                        if (error)
                            console.error(error)
                    })
                }
            }
        })
    })
    songCollection.find((error, songs) => {
        if(error)
            console.error(error) 
        else  
            songs.map(song => {
                if(!fs.existsSync(song.filepath))
                    songCollection.findByIdAndUpdate(song._id, { "orphan": true }, (error) => {
                        if(error)
                            console.error(error)
                    })
                else
                    songCollection.findByIdAndUpdate(song._id, { "orphan": false }, (error) => {
                        if(error)
                            console.error(error)
                    })
                
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