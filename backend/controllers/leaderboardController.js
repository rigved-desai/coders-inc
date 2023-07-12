const User = require('../models/userModel.js')

exports.getRankings = async (req, res, next) => {
    try {
        const users = await User.find().select('-_id username numberOfSolves').sort({numberOfSolves: -1})
        return res.status(200).json(users)
    }
    catch(e) {
        console.log(e.message)
        return res.status(401).json({
            result: "fail"
        })
    }
}