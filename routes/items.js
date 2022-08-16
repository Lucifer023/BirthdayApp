const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/itemsController')

// Creating one
router.post('/', itemsController.createItem)

// Deleting One
router.delete('/:id', itemsController.getItem, itemsController.deleteItem)

module.exports = router