const dbClient = require('./db-client')

module.exports = {
  async NEW_USER(payload) {
    console.log(`Sending email to: ${payload.email}`)
  },
  async CREATE_NEW_USER(data) {
    return dbClient.user.create({ data })
  },
}