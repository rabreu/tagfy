const express = require('express')
const router = express.Router()
const controller = require('../controllers/songController')

router.get('/songs', controller.getAll)
router.get('/artists', controller.getArtists)
router.post('/update', controller.updateDatabase)

module.exports = router