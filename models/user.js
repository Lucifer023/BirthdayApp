const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  wishlist: [{ type: Schema.Types.ObjectId, required: false, ref: 'Item' }],
  birthDate: {
    type: Date,
    required: true,
  }
})

module.exports = mongoose.model('User', userSchema)