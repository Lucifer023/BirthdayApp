const Item = require('../models/item')

global.username = null

// Creating one
exports.createItem = async (req, res) => {
  if(!req.body.name){
    return res.status(400).json({ message: 'Name of item not provided' })
  }

  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }
    const item = new Item({
      name: req.body.name,
      urlLink: req.body.urlLink
    })

    try {
      const newItem = await item.save()
      res.status(201).json(newItem)
    } catch (err) {
      res.status(400).json({ message: 'Name of item already exists' })
    }
  }

// Deleting One
exports.deleteItem = async (req, res) => {
  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }
    try {
      await res.item.remove()
      res.status(200).json({ message: 'Item Deleted' })
    } catch (err) {
      res.status(400).json({ message: 'Wrong Item ID format' })
    }
  }

// Get one item
exports.getItem = async (req, res, next) => {
  let item
  try {
    item = await Item.findById(req.params.id)
    console.log(item)
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }

  res.item = item
  next()
}

// Get all items
exports.getAllItems = async (req, res, next) => {
  let allItems
  try {
    allItems = await Item.find()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  
  res.allItems = allItems
  next()
}