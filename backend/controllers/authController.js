const User = require('../models/userModel.js')
const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    const options = {
        expiresIn: '12h'
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)
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
        return res.status(200).json({
            status: "success",
            message: "Registration Successful!"
        })
    }
    catch (e) {
        console.log(e.message)
        return res.status(200).json({
            status: "fail",
            message: "This email or username is already in use"
        })
    }
}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(200).json({
                message: "User does not exist!"
            })
        }
        if (await bcyrpt.compare(password, user.password)) {
            req.user = user.username
            const token = generateToken({ id: user._id, username: user.username, role: user.role })
            res.set('Authorization', 'Bearer ' + token);
            next()
        }
        else {
            return res.status(200).json({
                message: "Wrong password"
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