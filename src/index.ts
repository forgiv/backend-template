import { resolve } from 'path'

import { config } from 'dotenv'
config({ path: resolve(__dirname, '../.env') })

import Server from './server'

const server = new Server()

server.startApp()
