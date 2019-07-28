const router = require('express').Router()
const User = require('../models/user')

router.get('/:id', (req, res, next) => {
    const { id } = req.params

    User.findById(id)
        .then(user => {
            res.json(user)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    const { username, password } = req.body
    const user = { username, password }

    for (key in user) {
        let err
        if (user[key].trim() === '') { // Validate emptiness
            err = new Error(`${key} cannot be blank`)
        }
        else if (user[key].trim() !== user[key]) { // Validate trim status
            err = new Error(`${key} cannot start, or end, with whitespace`)
        }
        else if (key === 'username' && (user[key].length < 3 || user[key] > 16)) { // Validate length of username
            err = new Error('Username must be at least 3 characters and at most 16 characters.')
        }
        else if (key === 'password' && (user[key].length < 6 || user[key] > 32)) { // Validate length of password
            err = new Error('Password must be at least 6 characters and at most 32 characters.')
        }

        // If a validation error occured, pass to error handler
        if (err) {
            err.location = key
            err.status = 422
            next(err)
            return
        }
    }

    User.hashPassword(user.password)
        .then(hash => {
            user.password = hash
            return User.create(user)
        })
        .then(user => {
            return res
                .status(201)
                .location(`${req.originalUrl}/${user.id}`)
                .json(user)
        })
        .catch(err => {
            if (err.code === 11000) {
                err = new Error('Username already exists')
                err.status = 422
            }
            next(err)
        })
})

module.exports = router