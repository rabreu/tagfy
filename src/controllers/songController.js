const songCollection = require('../models/songSchema')
const Song = require('../models/Song')
const listFolderFiles = require('../fs/listFolderFiles')
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

const getArtists = (request, response) => {
    songCollection.find((error, songs) => {
        if (error)
            return response.status(500).send(error)
        const artists = []
        songs.forEach(song => {
            const artistExists = artists.find(artist => artist == song.artist )
            if(!artistExists) {
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
                const genreExists = genres.find(genre => genre == songGenre )
                if(!genreExists) {
                    genres.push(songGenre)
                }
            })
        })
        return response.status(200).send(genres)
    })
}

const updateDatabase = (request, response) => {
    listFolderFiles(PATH, (file) => {
        const id = md5File.sync(file)
        console.log(`${id} ${file}`)
        songCollection.findById(id, async (error, song) => {
            if (error)
                console.log(error)
            if (!song) {
                const songObj = new Song(file)
                await songObj.fillWithMetadata()
                new songCollection(songObj)
                    .save((error) => {
                        if (error)
                            console.error(error)
                    })
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
        if (error)
            console.error(error)
        else
            songs.map(song => {
                if (!fs.existsSync(song.filepath))
                    songCollection.findByIdAndUpdate(song._id, { "orphan": true }, (error) => {
                        if (error)
                            console.error(error)
                    })
                else
                    songCollection.findByIdAndUpdate(song._id, { "orphan": false }, (error) => {
                        if (error)
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
    getArtists,
    getGenres,
    updateDatabase
}