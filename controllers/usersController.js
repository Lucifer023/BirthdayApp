const moment = require('moment')
const User = require('../models/user')
const Item = require('../models/item')
const checkIfDuplicatesExist = require('../helper_functions/checkForDuplicatesArray')
const isNotDate = require('../helper_functions/checkIsDate')
const getCurrentDate = require('../helper_functions/getCurrentDay')

global.username = null

// Login
exports.login = async (req, res) => {
  if(!req.query.name){
    return res.status(400).json({ message: 'You need to provide your name' })
  }

  if(global.username !== null){
    return res.status(400).json({ message: 'You are already logged in' })
  }

  for(let oneUser of res.allUsers){
    if(oneUser.name === req.query.name){
      global.username = req.query.name
      return res.status(200).json({ message: 'You successfully logged in' })
  }}
  
  return res.status(404).json({ message: 'User does not exist' })
}

// Logout
exports.logout = async (req, res) => {
  if(global.username === null){
    return res.status(400).json({ message: 'You need to login first' })
  }
  global.username = null
  return res.status(200).json({ message: 'You successfully logged out' })
}

// Creating one
exports.creatingUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    birthDate: req.body.birthDate,
    wishlist: req.body.wishlist
  })

    if(!req.body.name){
      return res.status(400).json({ message: 'Username not provided' })
    }

    if(!req.body.birthDate){
      return res.status(400).json({ message: 'Birth date not provided' })
    }

    if(!req.body.wishlist){
      req.body.wishlist = []
    }

    if(checkIfDuplicatesExist(req.body.wishlist)){
      return res.status(400).json({ message: 'Wish list has duplicate items' })
    }

    if(isNotDate(req.body.birthDate)){
      return res.status(400).json({ message: 'Incorrect format of date' })
    }

    for(const id of req.body.wishlist){
      try {
        const item = await Item.findById(id)

        if(!item){
          return res.status(400).json({ message: 'Invalid item ID' })
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid item ID format' })
      }
    }
    
    for(const oneUser of res.allUsers){
      if(oneUser.name === req.body.name){
        return res.status(400).json({ message: 'User already exists' })
      }
    }

    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

// Adding item to users wish list
exports.addItemToWishList = async (req, res) => {
  let item
  let loggedUser

  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }

  if(!req.params.itemid){
    return res.status(400).json({ message: 'You need to choose which item you want to add to your wish list' })
  }

  try {
    item = await Item.findById(req.params.itemid)
  } catch(err) {
    return res.status(400).json({ message: 'You provided wrong format of item id' })
  }

  if(!item){
    return res.status(400).json({ message: 'Item not found' })
  }

  try {
    loggedUser = await User.findOne({ name: global.username })
  } catch(err) {
    return res.status(400).json({ message: 'There is no user with that username' })
  }
  
  let wishListOfLoggedUser = loggedUser.wishlist

  let wishListWithPreviousAndNew = [...wishListOfLoggedUser.map(item => item.toString()), req.params.itemid]

  if(checkIfDuplicatesExist(wishListWithPreviousAndNew)){
    return res.status(400).json({ message: 'Wish list has duplicate items' })
  }

  try {
    loggedUser.wishlist = wishListWithPreviousAndNew
    const newUser = await loggedUser.save()
    res.status(200).json(newUser)
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong' })
  }
}

// Upcoming birthdays
exports.usersWithUpcomingBirthdays = (req, res) => {
  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }
    const users = res.allUsers

    const usersWithUpcomingBirthdays = users.filter(user => moment(user.birthDate).set(`year`, moment().year()) >= getCurrentDate() && user.name !== global.username)

    let sortedUsers = usersWithUpcomingBirthdays.sort((a, b) => a.birthDate - b.birthDate)

    return res.status(200).json(sortedUsers)
}

exports.getAllUsers = async (req, res, next) => {
    let allUsers
    try {
      allUsers = await User.find()
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
    
    res.allUsers = allUsers
    next()
}
