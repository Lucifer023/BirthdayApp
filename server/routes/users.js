const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const itemsController = require('../controllers/itemsController')

// Creating one
router.post('/', usersController.getAllUsers,  itemsController.getAllItems, usersController.creatingUser)

// Login
router.post('/login', usersController.getAllUsers, usersController.login)

// Logout
router.post('/logout', usersController.logout)

// Users with upcoming birthdays
router.get('/upcomingBirthdays',  usersController.getAllUsers, usersController.usersWithUpcomingBirthdays)

// Getting user by user name
router.get('/:name', usersController.getUserByName)

// Adding item to wish list
router.get('/addItemToWishList/:itemid?', usersController.addItemToWishList)

module.exports = router
