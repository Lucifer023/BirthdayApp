const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  urlLink: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Item', itemSchema)