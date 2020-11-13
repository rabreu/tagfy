const express = require('express')
const app = express()
const cors = require('cors')

const db = require("./models/repository")
db.connect()

const routes = require("./routes/songRoutes")

app.use(cors())
app.use(express.json())
app.use('/tagfy', routes)

module.exports = app