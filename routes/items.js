const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/itemsController')
const usersController = require('../controllers/usersController')

// Creating one
router.post('/', itemsController.getAllItems, itemsController.createItem)

// Deleting One
router.delete('/:id', usersController.getAllUsers, itemsController.getItem, itemsController.deleteItem)

module.exports = router