const amqplib = require('amqplib')
const { Buffer } = require('buffer')
const { randomUUID } = require('crypto')
const { EventEmitter } = require('events')

const BROADCAST_QUEUE = 'BROADCAST'
const REPLY_QUEUE = 'REPLY_QUEUE'
const APP_QUEUE = 'APP_QUEUE'

const createRpcCallChannel = async (conn) => {
  const channel = await conn.createChannel()
  await channel.assertQueue(REPLY_QUEUE)
  // await channel.assertQueue(APP_QUEUE)
  channel.responseEmitter = new EventEmitter()
  channel.responseEmitter.setMaxListeners(Infinity)
  channel.consume(REPLY_QUEUE, async (msg) => {
    channel.responseEmitter.emit(msg.properties.correlationId, msg.content.toString())
  }, { noAck: true })
  return channel
}

const sendRPC = (rpcChannel, message, queue) => new Promise((resolve) => {
  const correlationId = randomUUID()
  rpcChannel.responseEmitter.once(correlationId, resolve)
  const data = Buffer.from(JSON.stringify(message))
  rpcChannel.sendToQueue(queue, data, {
    correlationId,
    replyTo: REPLY_QUEUE,
  })
})

module.exports = async () => {
  const conn = await amqplib.connect(process.env.AMQT_ADDRESS)
  const channel = await conn.createChannel()
  const rpcChannel = await createRpcCallChannel(conn)

  return {
    emit(type, payload) {
      const data = {
        type,
        payload,
      }
      channel.sendToQueue(BROADCAST_QUEUE, Buffer.from(JSON.stringify(data)))
    },
    async rpcCall(type, payload) {
      const data = {
        type,
        payload,
      }
      const rawResult = await sendRPC(rpcChannel, data, APP_QUEUE)
      return JSON.parse(rawResult)
    }
  }
}