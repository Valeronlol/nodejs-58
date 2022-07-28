const { isNumber, get } = require('lodash')
const logger = require('./logger')

module.exports = (err, req, res, next) => {
  const code = get(err, 'code', 500)

  logger.error({ error: err.message, trace: err.stack })

  res
    .status(isNumber(err.code) ? err.code : 500)
    .send({
      code,
      message: err.message,
    })
}
