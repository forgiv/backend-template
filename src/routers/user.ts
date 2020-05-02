import { Request, Response, Router } from "express"
import User, { User as IUser} from '../models/user'
import Error from '../util/error'

const router = Router()

router.get('/:id', (req: Request, res: Response, next: Function) => {
    const { id } = req.params

    User.findById(id)
        .then((user: IUser) => {
            res.json(user)
        })
        .catch((err: any) => next(err))
})

router.post('/', (req: Request, res: Response, next: Function) => {
    const user = { username: req.body.username, password: req.body.password }

    User.hashPassword(user.password)
        .then((hash: string) => {
            user.password = hash
            return User.create(user)
        })
        .then((user: IUser) => {
            return res
                .status(201)
                .location(`${req.originalUrl}/${user.id}`)
                .json(user)
        })
        .catch((err: any) => {
            if (err.code === 11000) {
                err = new Error('Username already exists', 422)
            }
            next(err)
        })
})

export default router
