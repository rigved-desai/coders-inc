exports.getHomePage = (req, res, next) => {
    const user = req.session.user
    if(!user) {
        res.redirect('/login')
    }
    return res.status(200).json({
        username: user.username
    })
}