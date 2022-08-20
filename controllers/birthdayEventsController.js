const moment = require('moment')
const BirthdayEvent = require('../models/birthdayEvent')
const UserPayment = require('../models/userPayment')
const User = require('../models/user')

global.username = null

// Creating one
exports.createBirthdayEvent = async (req, res) => {

    let birthdayPerson
    let birthdayEventOne
    let eventCreator
    let currentYear = new Date().getFullYear()
    let currentDate = new Date()

    if(!global.username){
        return res.status(401).json({ message: 'You need to login first' })
      }

    if(!req.body.birthdayPerson){
        return res.status(400).json({ message: 'You must enter the person who will celebrate the birthday'})
    }

    try {
        birthdayPerson = await User.findOne({ _id: req.body.birthdayPerson })
        if(birthdayPerson === null){
          return res.status(400).json({ message: 'There is no user with that user id' })
        }
      } catch(err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    try {
        birthdayEventOne = await BirthdayEvent.findOne({ birthdayPerson: req.body.birthdayPerson })
      } catch(err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    if(birthdayEventOne !== null){
        if(birthdayPerson._id.toString() === req.body.birthdayPerson){
            if(birthdayEventOne.eventDate > moment(currentDate).set('year', birthdayEventOne.eventDate.getFullYear())){
                return res.status(400).json({ message: 'You can not create more than one birthday event in a year' })
            }
        }
    }

    try {
      eventCreator = await User.findOne({ name: global.username })
    } catch(err) {
      return res.status(500).json({ message: 'Something went wrong' })
    }

    if(birthdayPerson.name === global.username){
        return res.status(400).json({ message: 'You cannot create birthday event for yourself'})
    }

    if(!req.body.totalMoneyAmount){
        return res.status(400).json({ message: 'You must enter how much money is needed for that birthday event'})
    }

    const birthdayPersonWithCurrentYear = moment(birthdayPerson.birthDate).set('year', currentYear)    

    if(birthdayPersonWithCurrentYear <= currentDate){
        return res.status(400).json({ message: 'You cannot create a birthday event for a date that has passed' })
    }

    const birthdayEvent = new BirthdayEvent({
        birthdayPerson: req.body.birthdayPerson,
        eventCreator: eventCreator._id.toString(),
        totalMoneyAmount: req.body.totalMoneyAmount,
        notes: '',
        participants: [],
        isBoughtPresent: false,
        eventDate: moment(birthdayPerson.birthDate).set('year', currentYear),
        totalCollectedAmount: 0
    })

    try {
        const newBirthdayEvent = await birthdayEvent.save()
        res.status(201).json(newBirthdayEvent)
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.addParticipantToBirthdayEvent = async (req, res) => {

    let loggedUser
    let birthdayEventObject
    let birthdayEventObjectUpdated
    let currentMoneyCollected

    if(!global.username){
        return res.status(401).json({ message: 'You need to login first' })
    }

    try {
        loggedUser = await User.findOne({ name: global.username })
    } catch(err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    const userPayment = new UserPayment({
        userId: loggedUser._id.toString(),
        amount: req.body.amount,
        message: req.body.message,
        birthdayEventId: req.body.birthdayEventId
    })

    if(!userPayment.birthdayEventId){
      return res.status(400).json({ message: 'Birthday event id not provided' })
    }

    if(!req.body.amount){
        return res.status(400).json({ message: 'Amount not provided' })
    }

    if(!req.body.message){
        return res.status(400).json({ message: 'Message not provided' })
    }

    const filter = { _id: userPayment.birthdayEventId }

    try {
        birthdayEventObject = await BirthdayEvent.findOne({ _id: userPayment.birthdayEventId })

        if(birthdayEventObject == null) {
            return res.status(404).json({ message: 'Cannot find birthday event' })
        }

        if(birthdayEventObject.participants.includes(userPayment.userId)){
            return res.status(400).json({ message: 'You cannot be participant more than one time' })
        }

        if(birthdayEventObject.birthdayPerson.toString() === loggedUser._id.toString()){
          return res.status(400).json({ message: 'You cannot be participant in your birthday event' })
        }

        const allParticipants = birthdayEventObject.participants.concat(loggedUser._id)

        const update = { participants:  allParticipants, totalCollectedAmount: birthdayEventObject.totalCollectedAmount + req.body.amount}

        currentMoneyCollected = birthdayEventObject.totalMoneyAmount - birthdayEventObject.totalCollectedAmount

        if(birthdayEventObject.totalMoneyAmount === birthdayEventObject.totalCollectedAmount){
          return res.status(400).json({ message: 'Money needed for present was collected' })
        }

        if(update.totalCollectedAmount > birthdayEventObject.totalMoneyAmount){
          return res.status(400).json(`You cannot give that amount of money. You can give ${currentMoneyCollected} or less than that`)
        }

        birthdayEventObjectUpdated = await BirthdayEvent.findOneAndUpdate(filter, update, {new: true})
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }

    try {
        const newUserPayment = await userPayment.save()
        res.status(200).json({ "birthdayEvent": birthdayEventObjectUpdated, "userPayment": newUserPayment })
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.getAllBirthdays = async (req, res) => {

  let loggedUser
  
  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }

  const birthdayEvents = res.allBirthdayEvents

  try{
    loggedUser = await User.findOne({ name: global.username })
  } catch (err){
    return res.status(500).json({ message: 'Something went wrong' })
  }

  const allBirthdays = birthdayEvents.filter(birthdayEvent => birthdayEvent.birthdayPerson.toString() !== loggedUser._id.toString())

  let sortedUsers = allBirthdays.sort((a, b) => a.eventDate - b.eventDate)

  return res.status(200).json(sortedUsers)
}

exports.getAllOpenBirthdays = async (req, res) => {
    if(!global.username){
        return res.status(401).json({ message: 'You need to login first' })
      }

      const currentDate = new Date()
    
      const birthdayEvents = res.allBirthdayEvents

      try{
        loggedUser = await User.findOne({ name: global.username })
      } catch (err){
        return res.status(500).json({ message: 'Something went wrong' })
      }
    
      const allOpenBirthdays = birthdayEvents.filter(birthdayEvent => {return moment(birthdayEvent.eventDate) > currentDate && birthdayEvent.birthdayPerson.toString() !== loggedUser._id.toString() && birthdayEvent.isBoughtPresent !== true}
      )
    
      let sortedUsers = allOpenBirthdays.sort((a, b) => a.eventDate - b.eventDate)
    
      return res.status(200).json(sortedUsers)
}

exports.getAllBirthdayEvents = async (req, res, next) => {
    let allBirthdayEvents
    try {
        allBirthdayEvents = await BirthdayEvent.find()
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
    
    res.allBirthdayEvents = allBirthdayEvents
    next()
}
