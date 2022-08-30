const moment = require('moment')
const User = require('../models/user')
const Item = require('../models/item')
const isNotDate = require('../helper_functions/checkIsDate')
const mongoose = require('mongoose')

global.username = null

// Login
exports.login = async (req, res) => {
  if(!req.query.name){
    return res.status(400).json({ message: 'You need to provide your name' })
  }

  if(global.username === req.query.name){
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
  let items
  let itemsListOfIds = []
  let userWishList = []
  const user = new User({
    name: req.body.name,
    birthDate: req.body.birthDate,
    wishlist: req.body.wishlist ? req.body.wishlist : []
  })

    if(!req.body.name){
      return res.status(400).json({ message: 'Username not provided' })
    }

    if(!req.body.birthDate){
      return res.status(400).json({ message: 'Birth date not provided' })
    }

    if(isNotDate(req.body.birthDate)){
      return res.status(400).json({ message: 'Incorrect format of date' })
    }

    for(const oneUser of res.allUsers){
      if(oneUser.name === req.body.name){
        return res.status(400).json({ message: 'User already exists' })
      }
    }

    try{
      items = await Item.find()
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' })
    }

    items.map(item => {
      itemsListOfIds.push(item._id.toString())
    })

    user.wishlist.map(wish => {
      userWishList.push(wish.toString())
    })

    let hasDuplicate = userWishList.some((val, i) => userWishList.indexOf(val) !== i);

    if(hasDuplicate){
      return res.status(400).json({ message: 'Wish list has duplicates items' })
    }

    for(let i = 0; i < userWishList.length; i++){
      let isNotIncluded = !itemsListOfIds.includes(userWishList[i])
      if(isNotIncluded){
        return res.status(400).json({ message: 'Item that you want to add to your wish list does not exist' })
      }
    }

    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch (err) {
      res.status(400).json({ message: 'Item id format is not correct' })
    }
  }

// Adding item to users wish list
exports.addItemToWishList = async (req, res) => {
  let item
  let loggedUser

  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }

  if(req.params.itemid === undefined){
    return res.status(400).json({ message: 'You need to choose which item you want to add to your wish list' })
  }

  try {
    item = await Item.findOne({ _id: req.params.itemid })
    if(item === null){
      return res.status(400).json({ message: 'Item not found' })
    }
  } catch(err) {
    return res.status(400).json({ message: 'You provided wrong format of item id' })
  }

  try {
    loggedUser = await User.findOne({ name: global.username })
  } catch(err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
  
  let wishListOfLoggedUser = loggedUser.wishlist

  const wishListWithPreviousAndNew = wishListOfLoggedUser.concat(req.params.itemid)

  if(wishListOfLoggedUser.includes(req.params.itemid)){
    return res.status(400).json({ message: 'Wish list has duplicate items' })
  }

  let objectIdArray = wishListWithPreviousAndNew.map(s => mongoose.Types.ObjectId(s));

  try {
    loggedUser.wishlist = objectIdArray
    const newUser = await loggedUser.save()
    res.status(200).json(newUser)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// Upcoming birthdays
exports.usersWithUpcomingBirthdays = (req, res) => {
  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }
  const currentYear = new Date().getFullYear()
  const currentDate = new Date()

  const users = res.allUsers

  const usersWithUpcomingBirthdays = users.filter(user => moment(user.birthDate).set('year', currentYear) >= currentDate && user.name !== global.username)

  let sortedUsers = usersWithUpcomingBirthdays.sort((a, b) => moment(a.birthDate).set('year', currentYear) - moment(b.birthDate).set('year', currentYear))

  return res.status(200).json(sortedUsers)
}

// Get user by username
exports.getUserByName = async (req, res) => {
  let user
  try {
    user = await User.findOne({ name: req.params.name })
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
  return res.status(200).json(user)
}

// Get all users
exports.getAllUsersFromDB = async (req, res) => {
  let allUsers
  try {
    allUsers = await User.find()
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
  return res.status(200).json(allUsers)
}

// Get all users middeware
exports.getAllUsers = async (req, res, next) => {
    let allUsers
    try {
      allUsers = await User.find()
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
    
    res.allUsers = allUsers
    next()
}
