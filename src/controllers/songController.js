const songCollection = require('../models/songSchema')
const Song = require('../models/Song')
const listFolderFiles = require('../fs/listFolderFiles')
const { PATH } = require('../conf')
const md5File = require('md5-file')
const fs = require('fs')
const md5 = require('md5-file')
const { response } = require('express')
const { resolve } = require('path')

const getAll = (request, response) => {
    songCollection.find((error, songs) => {
        if (error)
            return response.status(500).send(error)
        return response.status(200).send(songs)
    })
}

const getArtists = (request, response) => {
    songCollection.find((error, songs) => {
        if (error)
            return response.status(500).send(error)
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
    songCollection.find((error, songs) => {
        if (error)
            return response.status(500).send(error)
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
    response.status(200).send({
        "message": "Database update started."
    })
    const audioFiles = []
    await listFolderFiles(PATH, audioFiles)
    await new Promise(async (resolve, reject) => {
        let i = 0
        audioFiles.forEach((file) => {
            md5File(file)
                .then(id => {
                    songCollection.findById(id, async (error, song) => {
                        if (error)
                            reject(error)
                        if (!song) {
                            console.log(`add ${id} ${file}`)
                            const songObj = new Song(file)
                            await songObj.fillWithMetadata()
                            new songCollection(songObj)
                                .save((error) => {
                                    if (error)
                                        reject(error)
                                })
                        } else {
                            if (song.filepath != file) {
                                songCollection.findByIdAndUpdate(song._id, { "filepath": file }, (error) => {
                                    if (error)
                                        reject(error)
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
    songCollection.find((error, songs) => {
        if (error)
            console.error(error)
        else
            songs.map(song => {
                if (!fs.existsSync(song.filepath))
                    songCollection.findByIdAndUpdate(song._id, { "orphan": true }, { useFindAndModify: false }, (error) => {
                        if (error)
                            console.log(error)
                    })
                else
                    songCollection.findByIdAndUpdate(song._id, { "orphan": false }, { useFindAndModify: false }, (error) => {
                        if (error)
                            console.log(error)
                    })

            })
    })}

module.exports = {
    getAll,
    getArtists,
    getGenres,
    updateDatabase
}