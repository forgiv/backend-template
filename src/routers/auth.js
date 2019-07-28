const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const createAuthToken = user => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        subject: user.username,
        expiresIn: process.env.JWT_EXPIRY || '7d'
    })
}

const options = { session: false, failWithError: true }
const localAuth = passport.authenticate('local', options)

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user)
    return res.json({ authToken })
})

const jwtAuth = passport.authenticate('jwt', options)

router.post('/renew', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user)
    return res.json({ authToken })
})

module.exports = router