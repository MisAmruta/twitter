const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./Keys')
app.use(cors())
require('./models/user')
require('./models/post')
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))



mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection.on('connected', () => {
    console.log("mongoose connected")
})
mongoose.connection.on('error', () => {
    console.log("mongoose error")
})

app.listen(PORT, () => {
    console.log('server is running for twitter')
})