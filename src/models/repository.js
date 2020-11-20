const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { DATABASE_HOSTNAME, DATABASE_PORT, DATABASE_NAME } = require('../conf')

const URL = `mongodb://${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}`

const connect = () => {
    mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    const connection = mongoose.connection
    connection.on("error", () => console.log("Couldn't connect to MongoDB."))
    connection.once("open", () => console.log(`Connected to MongoDB on ${URL}.`))
}

module.exports = { connect }