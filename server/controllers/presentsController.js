const Present = require('../models/present')
const BirthdayEvent = require('../models/birthdayEvent')
const Items = require ('../models/item')
const Users = require ('../models/user')

global.username = null

// Creating one
exports.createPresent = async (req, res) => {
    let birthdayEventObject
    let items
    let personWhoHaveBirthday
    let updatedBirthdayEventObj
    let loggedUser
    const present = new Present({
        birthdayEventId: req.body.birthdayEventId,
        presentBought: req.body.presentBought
    })

    if(global.username === null){
        return res.status(400).json({ message: 'You need to login first' })
    }

    if(!present.birthdayEventId){
        return res.status(400).json({ message: 'You need to provide birthday event id' })
    }

    if(!present.presentBought){
        return res.status(400).json({ message: 'You need to provide present that you want to buy' })
    }

    try {
        birthdayEventObject = await BirthdayEvent.findById(present.birthdayEventId.toString())

        if(birthdayEventObject === null){
            return res.status(400).json({ message: 'Birthday event does not exist' })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    if(birthdayEventObject.totalMoneyAmount !== birthdayEventObject.totalCollectedAmount){
        return res.status(400).json({ message: 'You cannot buy a present before the money for the present has been collected' })
      }

    try {
        items = await Items.find()
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    try {
        presentItemForBuying = await Items.findById(present.presentBought)

        if(presentItemForBuying === null){
            return res.status(400).json({ message: 'Item that you provided as a present does not exist' })
        }

        if(birthdayEventObject.totalCollectedAmount < presentItemForBuying.price){
            return res.status(400).json({ message: "You don't have enough money to buy this present" })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    try {
        personWhoHaveBirthday = await Users.findById(birthdayEventObject.birthdayPerson.toString())
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    try {
        loggedUser = await Users.findOne({ name: global.username })
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    if(loggedUser._id.toString() !== birthdayEventObject.eventCreator.toString()){
        return res.status(400).json({ message: 'You are not event creator. Only event creator can buy a present' })
    }

    if(birthdayEventObject.isBoughtPresent === true){
        return res.status(400).json({ message: 'Present already bought for this birthday event' })
    }

    try {
        updatedBirthdayEventObj = await BirthdayEvent.findOneAndUpdate({ _id: present.birthdayEventId }, { isBoughtPresent: true }, {new: true})
    } catch(err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    try {
        const newPresent = await present.save()
        res.status(200).json({ "present": newPresent, "birthdayEvent": updatedBirthdayEventObj })
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// Get all presents
exports.getAllPresents = async (req, res) => {
    let allPresents
    try {
        allPresents = await Present.find()
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
    return res.status(200).json(allPresents)
}