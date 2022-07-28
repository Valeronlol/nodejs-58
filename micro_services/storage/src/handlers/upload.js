const dbClient = require('../db-client')

exports.updateProductImage = async (ctx) => {
    const id = parseInt(ctx.params.id)
    const image = ctx.request.body.imagePath
    ctx.body = await dbClient.product.update({
        where: {
            id,
        },
        data: {
            image,
        },
    })
}
