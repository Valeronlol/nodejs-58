const dbClient = require('../db-client')

exports.getList = async (ctx) => {
    ctx.body = await dbClient.product.findMany({
        take: 50
    })
}

exports.addProduct = async (ctx) => {
    ctx.body = await dbClient.product.create({ data: ctx.request.body })
}
