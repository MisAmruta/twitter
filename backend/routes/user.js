const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')


router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id }).populate('postedBy', '_id name email pic')
                .exec((err, post) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    else {
                        res.json({ user, post })
                    }
                })
        }).catch(err => console.log(err))
})

router.put('/updateProfile', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic }
    }, {
        new: true
    }, ((err, result) => {
        if (err) {
            res.status(422).json({ error: err })
        }

        res.json(result)
    })
    )
})

module.exports = router
