require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const usersRouter = require('./routes/users')
const itemsRouter = require('./routes/items')
const birthdayEventsRouter = require('./routes/birthdayEvents')
const presentsRouter = require('./routes/presents')
app.use('/users', usersRouter)
app.use('/items', itemsRouter)
app.use('/birtdayEvents', birthdayEventsRouter)
app.use('/presents', presentsRouter)

app.listen(3000, () => {
    console.log('Server Started')
})