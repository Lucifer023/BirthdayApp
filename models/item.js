const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  urlLink: {
    type: String,
    required: false,
  }
})

module.exports = mongoose.model('Item', itemSchema)