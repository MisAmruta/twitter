const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./Keys')

require('./models/user')
app.use(express.json())
app.use(cors())
app.use(require('./routes/auth'))


mongoose.connect(MONGOURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection.on('connected',()=>{
    console.log("mongoose connected")
})
mongoose.connection.on('error',()=>{
    console.log("mongoose error")
})

app.listen(PORT,()=>{
    console.log('server is running for twitter')
})