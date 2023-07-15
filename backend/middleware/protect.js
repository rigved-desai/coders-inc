const User = require('../models/userModel.js')

exports.allProtect = (req, res, next) => {
    const {user} = req.session

    if(!user) {
        return res.status(404).json({status: "fail", message: "Unauthorized to view"})
        // res.redirect('/login')
    }
    req.user = user
    next()
}

exports.personalProtect = async (req, res, next) => {
    const {user} = req.session
    const profile = await User.findOne({username: user.username})
    if(user._id != profile._id.valueOf()) {
        return res.status(404).json({status: "fail", message: "Unauthorized to view"})
    }
    next()
}

exports.adminProtect = async (req, res, next) => {
    const {user} = req.session
    const profile = await User.findOne({_id: user._id})
    console.log(profile)
    if(profile.role != "admin") {
        return res.status(404).json({status: "fail", message: "Unauthorized to view"})
    }
    next()
}