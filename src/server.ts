import express, { Express} from 'express'
import { RequestContext, MikroORM } from 'mikro-orm'
import morgan from 'morgan'
import passport from 'passport'
import cors from 'cors'

import localStrategy from './passport/local'
import jwtStrategy from './passport/jwt'

import routers from './routers'
import Error from './util/error'

import appConfig from './config/app'

export default class Server {
    app: Express
    orm: MikroORM

    async init() {
        this.setupExpress()
        await this.setupORM()
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
        this.app.use(appConfig.NODE_ENV === 'development' ? cors() : cors({ origin: appConfig.CLIENT_ORIGIN }))

        // Setting Morgan for logging
        this.app.use(
            morgan(appConfig.NODE_ENV === 'development' ? 'dev' : 'common', { 
                skip: () => appConfig.NODE_ENV === 'test' 
            })
        )

        // Parse JSON from request body
        this.app.use(express.json())
    }

    async setupORM() {
        // Initialize ORM
        try {
            this.orm = await MikroORM.init({
                entitiesDirs: ['./dist/entities'],
                entitiesDirsTs: ['./src/entities'],
                dbName: appConfig.MONGODB_NAME,
                type: 'mongo',
                clientUrl: appConfig.MONGODB_URI,
                ensureIndexes: true,
            })
        } catch {
            console.log('Error initializing database connection. Are you sure your db is started?')
            process.exit(1)
        }

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
        this.app.listen(appConfig.PORT, function() { console.info(`Server listening on port ${this.address().port}`) })
            .on('error', err => console.error(err))
    }
}
