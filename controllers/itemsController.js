const Item = require('../models/item')

global.username = null

// Creating one
exports.createItem = async (req, res) => {

  let allItemsNames = res.allItems

  if(!global.username){
    return res.status(401).json({ message: 'You need to login first' })
  }

  if(!req.body.name){
    return res.status(400).json({ message: 'Name of item not provided' })
  }

  if(!req.body.price){
    return res.status(400).json({ message: 'You need to provide price' })
  }

  if(allItemsNames.includes(req.body.name)){
    return res.status(400).json({ message: 'Item with that name already exist' })
  }

  const item = new Item({
    name: req.body.name,
    price: req.body.price,
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

  for(let oneUser of res.allUsers){
    for(let wish of oneUser.wishlist){
      if(wish.toString() === req.params.id){
        let response = await oneUser.updateOne(
          { "$pull": { "wishlist": wish } }
          )
      }
    }
  }

  try {
    let deletedItem = await res.item.remove()
    res.status(200).json({ "DeletedItem": deletedItem })
  } catch (err) {
    res.status(500).json({ message: err.message })
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