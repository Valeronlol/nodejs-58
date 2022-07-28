const { randomUUID } = require('crypto')
const logger = require('./logger')
const localStorage = require('./local-storage')

module.exports = (req, res, next) => {
  const uuid = randomUUID()
  const store = new Map()
  store.set('traceId', uuid)
  req.logger = logger
  localStorage.run(store, () => {
    req.logger.info('Logger been connected.')
    next()
  })
}