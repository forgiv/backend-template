import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import appConfig from '../config/app'

const options = {
    secretOrKey: appConfig.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
}

const jwtStrategy = new JwtStrategy(options, (payload, done: Function) => {
    done(null, payload.user)
})

export default jwtStrategy
