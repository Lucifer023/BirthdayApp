const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/itemsController')
const usersController = require('../controllers/usersController')

// Getting all items
router.get('/getAllItems', itemsController.getAllItemsFromDB)

// Creating one
router.post('/', itemsController.getAllItems, itemsController.createItem)

// Deleting One
router.delete('/:id', usersController.getAllUsers, itemsController.getItem, itemsController.deleteItem)

module.exports = router