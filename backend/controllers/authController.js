const User = require('../models/userModel.js')
const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    const options = {
        expiresIn: '1h'
    }
    const token = jwt.sign(payload, process.env.SESSION_SECRET, options)
    return token
}

exports.registerUser = async (req, res, next) => {

    //check for username and email existing in db first
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcyrpt.hash(password, 10)
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });
        const token = generateToken({ username: user._id })
        res.set('Authorization', 'Bearer ' + token);
        req.user = user;
        next()
    }
    catch (e) {
        console.log(e.message)
        return res.status(404).json({
            status: "fail",
            message: "this email or username is already in use"
        })
    }
}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(404).json({
                status: "User does not exist!"
            })
        }
        if (await bcyrpt.compare(password, user.password)) {
            req.user = user.username
            const token = generateToken({ id: user._id, username: user.username})
            res.set('Authorization', 'Bearer ' + token);
            next()
        }
        else {
            return res.status(404).json({
                status: "Wrong password"
            })
        }
    }
    catch (e) {
        console.log(e.message)
        return res.status(404).json({
            status: "fail"
        })
    }
}

exports.logoutUser = async (req, res, next) => {
    try {
        if (req.user) req.user = null;
        return res.status(200).json({
            status: "success"
        })
    }
    catch (e) {
        console.log(e.message)
        return res.status(404).json({
            status: "fail"
        })
    }
}