const Item = require('../models/item')

global.username = null

// Creating one
exports.createItem = async (req, res) => {

  let allItemsNames = res.allItems

  console.log(allItemsNames)

  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }

  if(!req.body.name){
    return res.status(400).json({ message: 'Name of item not provided' })
  }

  if(allItemsNames.includes(req.body.name)){
    return res.status(400).json({ message: 'Item with that name already exist' })
  }

  const item = new Item({
    name: req.body.name,
    urlLink: req.body.urlLink
  })

    try {
      const newItem = await item.save()
      res.status(201).json(newItem)
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }

// Deleting One
exports.deleteItem = async (req, res) => {

  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }

  try {
    let deletedItem = await res.item.remove()
    res.status(200).json({ "DeletedItem": deletedItem })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// Get one item
exports.getItem = async (req, res, next) => {
  let item
  try {
    item = await Item.findById(req.params.id)
    if(item === null){
      return res.status(400).json({ message: 'Item not found or wrong format of id' })
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
    return res.status(500).json({ message: 'Something went wrong' })
  }
  
  res.allItems = allItems.map(item => item.name)
  next()
}