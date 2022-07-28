const { join, resolve } = require('path')
require('dotenv').config({
    path: resolve(__dirname, '..', '.env')
})
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const handleError = require('./utils/global-error-handler')
const logger = require('./utils/logger')
const connectLogger = require('./utils/connect-logger')
const initAmqt = require('./services/amqt')
const router = require('./router')
const { wait } = require('./utils/helpers')

const port = parseInt(process.env.PORT) || 3000

async function main () {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer)
  
  await wait(3000)
  const amqt = await initAmqt()
  logger.info(`Message broker started!`)

  io.on('connection', (socket) => {
    setInterval(() => {
      socket.send('HELLO', {test: 1})
    }, 4000)
  })

  app.set('views', join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use((req, res, next) => {
    req.amqt = amqt
    next()
  })
  app.use(connectLogger)
  app.use(express.json())
  app.use(express.static(join(__dirname, '../', 'public')))
  app.use('/', router)
  app.use(handleError)

  httpServer.listen(port, () => {
    logger.info(`Server started on port ${port}!`)
  })
}
main()
