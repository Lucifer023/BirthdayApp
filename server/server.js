require('dotenv').config()

const express = require('express')
const cors = require('cors');
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL).catch(err => console.error(err))
const db = mongoose.connection
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors({
    origin: '*'
}));

const usersRouter = require('./routes/users')
const itemsRouter = require('./routes/items')
const birthdayEventsRouter = require('./routes/birthdayEvents')
const presentsRouter = require('./routes/presents')
app.use('/users', usersRouter)
app.use('/items', itemsRouter)
app.use('/birthdayEvents', birthdayEventsRouter)
app.use('/presents', presentsRouter)

app.listen(5000, () => {
    console.log('Server Started')
})