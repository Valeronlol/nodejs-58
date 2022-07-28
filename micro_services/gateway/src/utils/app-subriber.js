const EventEmitter = require('events')

class AppSubscriber extends EventEmitter {}

module.exports = new AppSubscriber()