const songCollection = require('../models/songSchema')
const Song = require('../models/Song')
const listFolderFiles = require('../fs/listFolderFiles')
const { PATH } = require('../conf')
const md5File = require('md5-file')
const fs = require('fs')

const getAll = (request, response) => {
    songCollection.find((err, songs) => {
        if (err)
            return response.status(500).send(err)
        return response.status(200).send(songs)
    })
}

const getArtists = (request, response) => {
    songCollection.find((err, songs) => {
        if (err)
            return response.status(500).send(err)
        const artists = []
        songs.forEach(song => {
            const artistExists = artists.find(artist => artist == song.artist)
            if (!artistExists) {
                artists.push(song.artist)
            }
        })
        return response.status(200).send(artists)
    })
}

const getGenres = (request, response) => {
    songCollection.find((err, songs) => {
        if (err)
            return response.status(500).send(err)
        const genres = []
        songs.forEach(song => {
            song.genre.forEach(songGenre => {
                const genreExists = genres.find(genre => genre == songGenre)
                if (!genreExists) {
                    genres.push(songGenre)
                }
            })
        })
        return response.status(200).send(genres)
    })
}

const updateDatabase = async (request, response) => {
    const START = Date.now()
    response.status(200).send({
        "message": "Database update started."
    })
    console.log("\x1b[0m\x1b[33m", "Database update started.")
    const audioFiles = []
    await listFolderFiles(PATH, audioFiles)
    await new Promise((resolve, reject) => {
        let i = 0
        audioFiles.forEach((file) => {
            md5File(file)
                .then(id => {
                    songCollection.findById(id, async (err, song) => {
                        if (err)
                            reject(err)
                        if (!song) {
                            console.log("\x1b[0m\x1b[32m", `[ADD] ${id} ${file}`)
                            const songObj = new Song(file)
                            await songObj.fillWithMetadata()
                            new songCollection(songObj)
                                .save((err) => {
                                    if (err)
                                        reject(err)
                                })
                        } else {
                            if (song.filepath != file) {
                                songCollection.findByIdAndUpdate(song._id, { "filepath": file }, (err) => {
                                    if (err)
                                        reject(err)
                                })
                            }
                        }
                    })
                    i++
                    if(i == audioFiles.length)
                        resolve()

                })
                .catch(err => {
                    reject(err)
                })
        })
    })
    .catch(err => {
        console.error(err)
    })
    await songCollection.find((err, songs) => {
        if (err)
            console.error(err)
        else
            songs.map(song => {
                if (!fs.existsSync(song.filepath)) {
                    console.log('\x1b[0m\x1b[35m', `[ORPHAN] ${song.id} ${song.filepath}`)
                    songCollection.findByIdAndUpdate(song._id, { "orphan": true }, { useFindAndModify: false }, (err) => {
                        if (err)
                            console.log(err)
                    })
                }
                else
                    songCollection.findByIdAndUpdate(song._id, { "orphan": false }, { useFindAndModify: false }, (err) => {
                        if (err)
                            console.log(err)
                    })

            })
    })
    const END = Date.now()
    console.log("\x1b[0m\x1b[33m", `Database update ended in ${(END-START)/1000} seconds.`)
}

const cleanDatabase = async (request, response) => {
    const START = Date.now()
    response.status(200).send({
        "message": "Database cleansing started."
    })
    console.log("\x1b[0m\x1b[33m", "Database cleansing started.")
    await songCollection.find((err, songs) => {
        if (err)
            console.error(err)
        else
            songs.map(song => {
                if (!fs.existsSync(song.filepath)) {
                    console.log('\x1b[0m\x1b[31m', `[DELETED] ${song.id} ${song.filepath}`)
                    songCollection.findByIdAndDelete(song._id, (err) => {
                        if (err)
                            console.log(err)
                    })
                }
            })
    })
    const END = Date.now()
    console.log("\x1b[0m\x1b[33m", `Database cleansing ended in ${(END-START)/1000} seconds.`)
}

module.exports = {
    getAll,
    getArtists,
    getGenres,
    updateDatabase,
    cleanDatabase
}