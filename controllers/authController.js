const UserModel = require('../model/User')
const jwt = require('jsonwebtoken')
const handleErrors = (err) => {
    console.log(`Error Message: ${err.message}, error code: ${err.code} `)
    let errors = {email: '', password: ''}

    if (err.message === 'incorrect email') {
        errors.email = 'wrong email'
    }
    if (err.message === 'incorrect password') {
        errors.password = 'wrong password'
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }
    if (err.code === 11000) {
        errors.email = 'email has already registered'
        return errors
    }

    return errors
}
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({id}, 'my new secret', {
        expiresIn: maxAge
    })
}

exports.signup_get = ((req, res) => {
    res.render('signup')
})

exports.login_get = ((req, res) => {
    res.render('login')
})

exports.signup_post = (async (req, res) => {
    console.log(req.body)
    const {email, password} = req.body

    try {
        const user = await UserModel.create({email, password})
        const token = createToken(user._id)
        res.cookie('JWT', token, {httpOnly: true, maxAge: maxAge * 1000})
        console.log("token is ----" + token)
        res.status(201).json({user: user._id})

    } catch (e) {
        const err = handleErrors(e)
        res.status(400).json({err})
    }
})

exports.login_post = (async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await UserModel.login(email, password)
        const token = createToken(user._id)
        res.cookie('JWT', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id})
    } catch (e) {
        const err = handleErrors(e)
        res.status(400).json({err})
    }
})

exports.logout_get = (req, res) => {
    res.cookie('JWT','',{maxAge:1})
    res.redirect('/')
}
