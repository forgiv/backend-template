import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

const options = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
}

const jwtStrategy = new JwtStrategy(options, (payload, done: Function) => {
    done(null, payload.user)
})

export default jwtStrategy
