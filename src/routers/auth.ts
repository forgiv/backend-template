import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Router, Request, Response } from 'express'

const router = Router()

const createAuthToken = (user: any) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        subject: user.username,
        expiresIn: process.env.JWT_EXPIRY || '7d'
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
