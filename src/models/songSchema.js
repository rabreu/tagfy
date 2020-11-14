const mongoose = require("mongoose")
const Schema = mongoose.Schema

const songSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        auto: false,
        required: true
    },
    artist: {
        type: String,
        required: false

    },
    track: {
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    album: {
        type: String,
        required: false
    },
    duration: {
        type: Number,
        required: true
    },
    genre: [{
        type: String,
        required: false
    }], 
    year: {
        type: String,
        required: false
    },
    filepath: {
        type: String,
        required: true
    },
    properties: {
        lossless: { type: Boolean, required: false },
        container: { type: String, required: false },
        codec: { type: String, required: false },
        sampleRate: { type: Number, required: false },
        numberOfChannels: { type: Number, required: false },
        bitrate: { type: Number, required: false },
        tool: { type: String, required: false },
        codecProfile: { type: String, required: false }
    }
})

const songCollection = mongoose.model('songs', songSchema)

module.exports = songCollection