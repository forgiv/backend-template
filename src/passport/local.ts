import { Strategy as LocalStrategy } from 'passport-local'
import User, { User as IUser } from '../models/user'

const localStrategy = new LocalStrategy((username: string, password: string, done: Function) => {
    let user: IUser
    User.findOne({ username })
        .then((_user: IUser) => {
            user = _user
            if (!user) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username',
                    location: 'username',
                    status: 401
                })
            }
        })
        .then(() => {
            return user.validatePassword(password)
        })
        .then((isValid: Boolean) => {
            if (!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect password',
                    location: 'password',
                    status: 401
                })
            }
            return done(null, user)
        })
        .catch((err: any) => {
            if (err.reason !== 'LoginError') {
                return done(null, false)
            }
            return done(err)
        })
})

export default localStrategy
