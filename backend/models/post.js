const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({

    body: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: false
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: "User" }
    }],
    postedBy: {
        type: ObjectId,
        ref: "User"
    }

})

mongoose.model("Post", postSchema)