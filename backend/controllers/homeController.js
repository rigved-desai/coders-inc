exports.getHomePage = (req, res, next) => {
    const user = req.session.user
    if(!user) {
        res.status(404).json({
            result: "fail"
        })
    }
    return res.status(200).json({
        username: user.username
    })
}