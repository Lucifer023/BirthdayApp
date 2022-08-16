const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

// Login
router.post('/login', usersController.getAllUsers, usersController.login)

// Logout
router.post('/logout', usersController.logout)

// Creating one
router.post('/', usersController.getAllUsers, usersController.creatingUser)

// Adding item to wish list
router.get('/addItemToWishList/:itemid', usersController.addItemToWishList)

// Users with upcoming birthdays
router.get('/upcomingBirthdays',  usersController.getAllUsers, usersController.usersWithUpcomingBirthdays)

module.exports = router
