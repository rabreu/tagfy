const mm = require('music-metadata')
const md5File = require('md5-file')

class Song {
    constructor(filepath) {
        this._id = md5File.sync(filepath)
        this.artist = null
        this.track = null
        this.title = null
        this.album = null
        this.duration = null
        this.genre = null
        this.year = null
        this.filepath = filepath
        this.properties = null
        this.orphan = null
    }

    async fillWithMetadata() {
        await mm.parseFile(this.filepath)
            .then(metadata => {
                this.artist = metadata.common.artist
                this.track = metadata.common.track.no
                this.title = metadata.common.title
                this.album = metadata.common.album
                this.duration = metadata.format.duration
                this.genre = metadata.common.genre
                this.year = metadata.common.year
                this.properties = {
                    "lossless": metadata.format.lossless,
                    "container": metadata.format.container,
                    "codec": metadata.format.codec,
                    "sampleRate": metadata.format.sampleRate,
                    "numberOfChannels": metadata.format.numberOfChannels,
                    "bitrate": metadata.format.bitrate,
                    "tool": metadata.format.tool,
                    "codecProfile": metadata.format.codecProfile
                }
                this.orphan = false
            })
            .catch(err => {
                console.error(err.message);
            });
    }
}

module.exports = Song