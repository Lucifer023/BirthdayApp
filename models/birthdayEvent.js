const mongoose = require('mongoose')
const Schema = mongoose.Schema

const birthdayEventSchema = new mongoose.Schema({
  birthdayPerson: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  participants: [{ type: Schema.Types.ObjectId, required: true, ref: 'UserPayment' }],
  eventCreator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  totalMoneyAmount: {
    type: number,
    required: true
  },
  notes: {
    type: String,
    required: true
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