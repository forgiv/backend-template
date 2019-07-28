const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
}

const jwtStrategy = new JwtStrategy(options, (payload, done) => {
    done(null, payload.user)
})

module.exports = jwtStrategy