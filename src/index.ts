import { resolve } from 'path'

import { config } from 'dotenv'
config({ path: resolve(__dirname, '../.env') })

import Server from './server'

export const server = new Server()

// Hack to make app wait for db connection before starting
async function startApp() {
    await server.init()
    server.startApp()
}

startApp()