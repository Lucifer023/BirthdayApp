const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userPaymentSchema = new mongoose.Schema({
  birthdayEventId: { type: Schema.Types.ObjectId, required: true, ref: 'BirthdayEvent' },
  participants: [{ type: Schema.Types.ObjectId, required: true, ref: 'UserPayment' }],
  presentBought : { type: Schema.Types.ObjectId, required: true, ref: 'Item' },
})

module.exports = mongoose.model('Present', userPaymentSchema)