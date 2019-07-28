const authRouter = require('./auth')
const userRouter = require('./user')

module.exports = [
    {
        path: '/api',
        routes: authRouter
    },
    {
        path: '/api/user',
        routes: userRouter
    }
]