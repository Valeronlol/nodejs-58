const Router = require('@koa/router')
const productHandlers = require('./handlers/product')
const userHandlers = require('./handlers/user')
const uploadHandlers = require('./handlers/upload')
const userSchema = require('./schemas/user')
const validationMiddleware = require('./middleware/validation-middleware')

const router = new Router()

router.get('/product', productHandlers.getList)
router.post('/product', productHandlers.addProduct)
router.post('/login', userHandlers.getUserByEmail)
router.post('/user', validationMiddleware(userSchema.createNewUser), userHandlers.createNewUser)
router.put('/product/:id/image', uploadHandlers.updateProductImage)

module.exports = router
