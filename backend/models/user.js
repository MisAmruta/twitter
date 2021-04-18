const mongoose = require('mongoose')
const {ObjectId } = mongoose.Schema.Types
const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/daq2pyhfj/image/upload/v1616437227/flower_iapdy6.jpg"
    },
    followers:[{type:ObjectId,ref:'User'}],
    following:[{type:ObjectId,ref:'User'}]
})

mongoose.model('User',UserSchema)