const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../Keys')
const User = mongoose.model('User')

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        return res.json({ error: "fill up all entries" })
    }
    User.findOne({ email: email }).then(user => {
        if (user) {
            return res.json({ error: "already exists" })
        }
        bcrypt.hash(password, 12).then(hashpassword => {
            const user = new User({
                name,
                email,
                password: hashpassword,
                pic
            })
            user.save().then(saveduser => {
                if (saveduser) {
                    res.json({ message: 'account created successfully' })
                } else {
                    return res.json({ error: 'account creation failed' })
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({ error: "fill up all entries" })
    }
    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.json({ error: "Invalid user" })
        }
        bcrypt.compare(password, user.password).then(saveduser => {
            if (saveduser) {
                const token = jwt.sign({ _id: user._id }, JWT_SECRET)
                const { _id, name, email, pic, followers, following } = user
                res.json({ token, user: { _id, name, email, pic, followers, following } })
            } else {
                res.json({ error: 'Login failed' })
            }

        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
})

module.exports = router