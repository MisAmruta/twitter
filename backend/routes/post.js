const mongoose = require('mongoose');
const express = require('express');
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

router.post('/createpost', requireLogin, (req, res) => {
    const { body, pic } = req.body

    if (!body) {
        return res.status(422).json({ error: 'Please add all fields.' })
    }
    req.password = undefined
    const post = new Post({
        body,
        pic,
        postedBy: req.user
    })
    post.save().then(data => {
        res.json({ post: data })
    }).catch(error => console.log(error))
})

router.get('/allpost', requireLogin, (req, res) => {
    Post.find().populate("postedBy", "_id name pic email")
        .populate("comments.postedBy", "_id name pic")
        .then(posts => {
            res.json({ posts })
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postID, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        else {
            res.json({ result })
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postID, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        else {
            res.json({ result })
        }
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postID, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")

        .exec((err, result) => {
            if (err) {
                res.status(422).json({ err: err })
            }
            else {
                res.json(result)
            }
        })
})

// router.put('/comment', requireLogin, (req, res) => {
//     const comment = {
//         text: req.body.text,
//         postedBy: req.user._id
//     }
//     Post.findByIdAndUpdate(req.body.postID, {
//         $push: { comments: comment }

//     }, {
//         new: true
//     }).populate("comments.postedBy", "_id name")
//         .populate("postedBy", "_id name")
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(422).json({ error: err })
//             }
//             else {
//                 res.json({ result })
//             }
//         })
// })


router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id }).populate('postedBy', '_id name email pic')
        .then(post => {
            res.json({ post })
        })
})

module.exports = router