const { Router } = require('express')
const mainController = require('./controllers/main-page')
const userController = require('./controllers/user')
const productsController = require('./controllers/products')
const uploadController = require('./controllers/upload')
const asyncErrorHandler = require('./utils/async-error-handler')
const validationMiddleware = require('./utils/validation-middleware')
const { checkAuth } = require('./services/auth')
const userSchemas = require('./schemas/user')

const router = Router()

router.get('/', mainController)
router.post('/user', validationMiddleware(userSchemas.createUser), asyncErrorHandler(userController.createUser))
router.post('/login', validationMiddleware(userSchemas.authenticateUser), asyncErrorHandler(userController.authenticateUser))
router.get('/product', asyncErrorHandler(productsController.getList))
router.get('/product/subribe', asyncErrorHandler(productsController.getListSubsribe))
router.post('/product', checkAuth, asyncErrorHandler(productsController.addProduct))
router.put('/product/:id/image', checkAuth, asyncErrorHandler(uploadController.uploadImage))
router.put('/user/image', checkAuth, asyncErrorHandler(uploadController.uploadImage))
router.get('*', (req, res) => {
    res.render('404', {
        title: 'Not found page',
    })
})

module.exports = router
