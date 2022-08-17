const express = require('express')
const router = express.Router()
const presentsController = require('../controllers/presentsController')

// Creating one
router.post('/', presentsController.createPresent)

module.exports = router