const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { DATABASE_HOSTNAME, DATABASE_PORT, DATABASE_NAME } = require('../conf')

const connect = () => {
    mongoose.connect(`mongodb://${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
    const connection = mongoose.connection
    connection.on("error", () => console.log("Couldn't connect to MongoDB."))
    connection.once("open", () => console.log("Connected to  MongoDB."))
}

module.exports = { connect }