import { Strategy as LocalStrategy } from 'passport-local'
import { User } from '../entities/user'

import { server } from '../index'
import Error from '../util/error'

const localStrategy = new LocalStrategy(async (username: string, password: string, done: Function) => {
    let user: User

    try {
        user = await server.orm.em.findOneOrFail(User, { username })
        await user.validatePassword(password)
        return done(null, user)
    } catch {
        const err = new Error('Incorrect Login Details', 401)
        return done(err)
    }
})

export default localStrategy
