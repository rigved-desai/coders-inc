const User = require('../models/userModel.js')
const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

exports.registerUser = async (req, res, next) => {
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
            status: "fail"
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