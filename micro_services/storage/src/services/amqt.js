const amqplib = require('amqplib')
const { Buffer } = require('buffer')
const AMQTController = require('../amqt-controller')

const BROADCAST_QUEUE = 'BROADCAST'
const APP_QUEUE = 'APP_QUEUE'

module.exports = async () => {
  const conn = await amqplib.connect(process.env.AMQT_ADDRESS)

  const channel = await conn.createChannel()
  const appChannel = await conn.createChannel()

  await channel.assertQueue(BROADCAST_QUEUE)
  await appChannel.assertQueue(APP_QUEUE)

  channel.consume(BROADCAST_QUEUE, async (msg) => {
    if (msg) {
      const rawData = msg.content.toString()
      const { type, payload } = JSON.parse(rawData)
      if (AMQTController[type]) {
        await AMQTController[type](payload)
      }
      channel.ack(msg)
    }
  })

  appChannel.consume(APP_QUEUE, async (msg) => {
    try {
      if (msg) {
        const rawData = msg.content.toString()
        const { type, payload } = JSON.parse(rawData)
        if (AMQTController[type]) {
          const controllerResult = await AMQTController[type](payload)
          const buff = Buffer.from(JSON.stringify(controllerResult))
          appChannel.sendToQueue(msg.properties.replyTo, buff, {
            correlationId: msg.properties.correlationId,
          })
        } else {
          const buff = Buffer.from(JSON.stringify({
            error: `Controller ${type} does not exists!`,
          }))
          appChannel.sendToQueue(msg.properties.replyTo, buff, {
            correlationId: msg.properties.correlationId,
          })
        }
      }
    } catch (err) {
      console.error(err)
      const buff = Buffer.from(JSON.stringify({
        error: err.message,
      }))
      appChannel.sendToQueue(msg.properties.replyTo, buff, {
        correlationId: msg.properties.correlationId,
      })
    } finally {
      channel.ack(msg)
    }
  })
}