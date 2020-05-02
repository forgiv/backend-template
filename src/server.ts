import express, { Express} from 'express'
import { RequestContext, MikroORM } from 'mikro-orm'
import morgan from 'morgan'
import passport from 'passport'
import cors from 'cors'

import localStrategy from './passport/local'
import jwtStrategy from './passport/jwt'

import routers from './routers'
import Error from './util/error'

export default class Server {
    app: Express
    orm: MikroORM

    constructor() {
        this.setupExpress()
        this.setupORM()
        this.setupPassport()
        this.mountRoutes()
    }

    setupPassport() {
        // Mount strategies
        passport.use(localStrategy)
        passport.use(jwtStrategy)
    }

    setupExpress() {
        // Create App
        this.app = express()

        // Setting CORS
        this.app.use(
            process.env.NODE_ENV === 'development'
            ? cors()
            : cors({ origin: process.env.CLIENT_ORIGIN })
        )

        // Setting Morgan for logging
        this.app.use(
            morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', { 
                skip: () => process.env.NODE_ENV === 'test' 
            })
        )

        // Parse JSON from request body
        this.app.use(express.json())
    }

    async setupORM() {
        // Initialize ORM
        this.orm = await MikroORM.init({
            entitiesDirs: ['./dist/entities'],
            entitiesDirsTs: ['./src/entities'],
            dbName: process.env.DB_NAME,
            type: 'mongo',
            clientUrl: process.env.MONGODB_URI,
            ensureIndexes: true,
        })

        // Mount on App
        this.app.use((req: express.Request, res: express.Response, next: any) => {
            RequestContext.create(this.orm.em, next)
        })
    }

    mountRoutes() {
        // Mounting Routers
        for (const router of routers) {
            this.app.use(router.path, router.routes)
        }

        // Catch-all 404
        this.app.use((_req: express.Request, _res: express.Response, next: Function) => {
            const err = new Error('Not Found', 404)
            next(err)
        })

        // Catch-all Error
        this.app.use((err: Error, req: express.Request, res: express.Response, next: Function) => {
            console.log(`${err.status || 500}: ${err.message}`)
            res.status(err.status || 500)
            res.json({
                message: err.message,
                error: this.app.get('env') === 'development' ? err : {}
            })
        })
    }

    startApp() {
        // Start server
        this.app.listen(process.env.PORT, function() { console.info(`Server listening on port ${this.address().port}`) })
            .on('error', err => console.error(err))
    }
}
