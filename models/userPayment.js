const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userPaymentSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: false
  },
  birthdayEventId: {
    type: Schema.Types.ObjectId,
    ref: 'BirthdayEvent',
    required: true
  }
})

module.exports = mongoose.model('UserPayment', userPaymentSchema)