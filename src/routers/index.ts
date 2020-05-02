import authRouter from './auth'
import userRouter from './user'

export default [
    {
        path: '/api',
        routes: authRouter
    },
    {
        path: '/api/user',
        routes: userRouter
    }
]
