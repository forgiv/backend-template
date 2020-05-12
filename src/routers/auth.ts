import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Router, Request, Response } from 'express'
import appConfig from '../config/app'

const router = Router()

const createAuthToken = (user: any) => {
    return jwt.sign({ user }, appConfig.JWT_SECRET, {
        subject: user.username,
        expiresIn: appConfig.JWT_EXPIRY,
    })
}

const options = { session: false, failWithError: true }
const localAuth = passport.authenticate('local', options)

router.post('/login', localAuth, (req: Request, res: Response) => {
    const authToken = createAuthToken(req.user)
    return res.json({ authToken })
})

const jwtAuth = passport.authenticate('jwt', options)

router.post('/renew', jwtAuth, (req: Request, res: Response) => {
    const authToken = createAuthToken(req.user)
    return res.json({ authToken })
})

export default router
