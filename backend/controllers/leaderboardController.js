const User = require('../models/userModel.js')

exports.getRankings = async (req, res, next) => {
    try {
        const users = await User.find({}).sort({numberOfSolves: -1}).exec()
        return res.status(200).json(users)
    }
    catch(e) {
        console.log(e.message)
        return res.status(401).json({
            result: "fail"
        })
    }
}