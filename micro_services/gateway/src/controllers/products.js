const { getProductsList, addProduct } = require('../services/data-client')
const appSubscriber = require('../utils/app-subriber')
const { AppError } = require('../utils/app-errors')

exports.getList = async (req, res) => {
    req.logger.info('Controller getList called.')
    const productList = await getProductsList({ limit: 10 }) || []
    req.logger.info('productList received.')
    if (!productList.length) {
        req.logger.info('productList is empty!')
    }
    res.send(productList)
}

exports.getListSubsribe = async (req, res, next) => {
    appSubscriber.once('PRODUCT_ADDED', (newProduct) => {
        res.send([newProduct])
    })
    setTimeout(() => {
        next(new AppError({
            message: 'Timeout',
            code: 504,
        }))
    }, 60000)
}

exports.addProduct = async (req, res) => {
    const newProduct = await addProduct(req.body)
    res.send(newProduct)
    appSubscriber.emit('PRODUCT_ADDED', newProduct)
}
