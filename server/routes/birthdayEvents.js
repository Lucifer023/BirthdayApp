const express = require('express')
const router = express.Router()
const birthdayEventsController = require('../controllers/birthdayEventsController')

// Creating one
router.post('/', birthdayEventsController.createBirthdayEvent)

// Updating birthday event with participant
router.post('/updateWithParticipant', birthdayEventsController.addParticipantToBirthdayEvent)

// Getting all birtdays
router.get('/allBirthdays', birthdayEventsController.getAllBirthdayEvents , birthdayEventsController.getAllBirthdays)

// Getting all open birtdays
router.get('/allOpenBirthdays', birthdayEventsController.getAllBirthdayEvents, birthdayEventsController.getAllOpenBirthdays)

module.exports = router