const express = require('express')
const router = express.Router()
const presentsController = require('../controllers/presentsController')

// Get all presents
router.get('/allPresents', presentsController.getAllPresents)

// Creating one
router.post('/', presentsController.createPresent)

module.exports = router