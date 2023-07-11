exports.getHomePage = (req, res, next) => {
    const user = req.session.user
    return res.status(200).json({
        username: user.username
    })
}