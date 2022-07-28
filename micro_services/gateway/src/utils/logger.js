const winston = require('winston')
const localStorage = require('./local-storage')

const withTraceId = winston.format((info) => {
  const store = localStorage.getStore()
  if (store) {
    info.traceId = store.get('traceId')
  }
  return info
})

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    withTraceId(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'gateway' },
  transports: [
    new winston.transports.File({ filename: `${process.env.LOGS_PATH}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${process.env.LOGS_PATH}/warning.log`, level: 'warning' }),
    new winston.transports.File({ filename: `${process.env.LOGS_PATH}/combined.log` }),
  ],
})

if (process.env.NODE_ENV === 'development') {
  const consoleColorFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
  logger.add(new winston.transports.Console({
    format: consoleColorFormat,
  }))
}

module.exports = logger
