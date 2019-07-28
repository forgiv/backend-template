require('dotenv').config() // Setting environment variables

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')
const cors = require('cors')

const localStrategy = require('./passport/local')
const jwtStrategy = require('./passport/jwt')

const routers = require('./routers')

// Mounting strategies
passport.use(localStrategy)
passport.use(jwtStrategy)

const app = express() // Create app

// Setting CORS
app.use(
    process.env.NODE_ENV === 'development'
    ? cors()
    : cors({ origin: process.env.CLIENT_ORIGIN })
)

// Setting Morgan for logging
app.use(
    morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', { 
        skip: () => process.env.NODE_ENV === 'test' 
    })
)

// Parse JSON from request body
app.use(express.json())

// Routers portion
for (router of routers) {
    app.use(router.path, router.routes)
}

// Catch-all 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Catch-all Error
app.use((err, req, res, next) => {
    console.log(`${err.status || 500}: ${err.message}`)
    res.status(err.status || 500)
    res.json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    })
})

if (require.main === module) {
    // Connect to MongoDB
    mongoose
        .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
        .then(instance => {
            const conn = instance.connections[0]
            console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`)
        })
        .catch(err => {
            console.error(`ERROR: ${err.message}`)
        })
    
    // Start server
    app.listen(process.env.PORT, function() { console.info(`Server listening on port ${this.address().port}`) })
        .on('error', err => console.error(err))
}

module.exports = app