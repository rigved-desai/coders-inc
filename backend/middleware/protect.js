const User = require('../models/userModel.js')

exports.allProtect = (req, res, next) => {
    const {user} = req.session

    if(!user) {
        // return res.status(401).json({status: "fail", message: "Unauthorized to view"})
        res.redirect('/login')
    }
    req.user = user
    next()
}

exports.personalProtect = (req, res, next) => {
    const {user} = req.session

    const profile = User.find(req.params.username)
    if(user.id != profile.id) {
        return res.status(401).json({status: "fail", message: "Unauthorized to view"})
    }
    next()
}

exports.adminProtect = (req, res, next) => {
    const {user} = req.session

    const profile = User.find(req.params.username)
    if(profile.role != "admin") {
        return res.status(401).json({status: "fail", message: "Unauthorized to view"})
    }
    next()
}