import { resolve } from 'path'

import { config } from 'dotenv'
config({ path: resolve(__dirname, '../.env') })

import Server from './server'

export const server = new Server()

server.startApp()
