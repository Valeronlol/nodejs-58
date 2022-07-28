const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const errorHandler = require('./middleware/global-error-handler')
const initAmqt = require('./services/amqt')
const { wait } = require('./utils/helpers')

const port = parseInt(process.env.PORT) || 3000

async function main () {
    await wait(3000)
    await initAmqt()
    console.log(`Message broker started!`)

    app.use(errorHandler)
    app.use(bodyParser())
    app.use(router.routes())

    app.listen(port, () => {
        console.log(`We are listening http://127.0.0.1:${port}`)
    })
}
main()