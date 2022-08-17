const mongoose = require('mongoose')
const Schema = mongoose.Schema

const birthdayEventSchema = new mongoose.Schema({
  birthdayPerson: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  participants: [{ type: Schema.Types.ObjectId, required: false, ref: 'UserPayment' }],
  eventCreator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  totalMoneyAmount: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  isBoughtPresent: {
    type: Boolean,
    required: false
  },
  eventDate: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('BirthdayEvent', birthdayEventSchema)