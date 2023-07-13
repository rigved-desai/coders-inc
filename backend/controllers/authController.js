const User = require('../models/userModel.js')
const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

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
        req.session.user = user;
        next()
    }
    catch(e) {
        console.log(e.message)
        return res.status(404).json({
            status: "fail",
            message: "this email or username is already in use"
        })
    }
}

exports.loginUser = async(req, res, next) => {
    const {email, password} = req.body
    
    try {
        const user = await User.findOne({email: email});
        // console.log(user)
        if(!user) {
            return res.status(404).json({
                status: "User does not exist!"
            })
        }
       if(await bcyrpt.compare(password, user.password)) {
            req.session.user = user
            req.user = user.username
            next()
        }
        else {
            return res.status(404).json({
                status: "Wrong password"
            })
        }
    }
    catch(e) {
        console.log(e.message)
        return res.status(404).json({
            status: "fail"
        })
    }
}
exports.logoutUser = async(req, res, next) => {
    try {
        req.session = null;
        return res.status(200).json({
            status: "success"
        })         
    }
    catch(e) {
        console.log(e.message)
        return res.status(404).json({
            status: "fail"
        })
    }
}