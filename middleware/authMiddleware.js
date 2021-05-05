const jwt = require('jsonwebtoken')
const UserScheme = require('../model/User')
const requireAuth = (req, res, next) => {
    const token = req.cookies.JWT
    if (token) {
        jwt.verify(token, 'my new secret', (err, decodedToken) => {
            if (err) {
                res.redirect('/login')
            } else {
                next()
            }

        })
    } else {
        res.redirect('/login')
    }
}
const checkUser = (req, res, next) => {
    const token = req.cookies.JWT
    if (token) {
        jwt.verify(token, 'my new secret', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            } else {
                res.locals.user = await UserScheme.findById(decodedToken.id)
                next()
            }

        })
    } else {
        res.locals.user = null
        next()
    }

}


module.exports = {requireAuth, checkUser}