import { Request, Response, Router } from "express"
import { User } from '../entities/user'
import Error from '../util/error'
import { server } from '../index'

const router = Router()

router.get('/:id', async (req: Request, res: Response, next: Function) => {
    const { id } = req.params

    try {
        const user = await server.orm.em.findOneOrFail(User, id)
        res.json(user)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req: Request, res: Response, next: Function) => {
    try {
        let user = new User(req.body.username, req.body.password)
        await server.orm.em.persistAndFlush(user)
        user = await server.orm.em.findOneOrFail(User, { username: user.username })
        res.status(201).location(`${req.originalUrl}/${user.id}`).json(user)
    } catch (err) {
        next(err)
    }
})

export default router
