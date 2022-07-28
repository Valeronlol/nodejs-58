const { Prisma } = require('@prisma/client')

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            ctx.response.status = 409
            ctx.body = {
                message: 'Database error!'
            }
            console.error(err)
            return
        }

        ctx.response.status = err.code || 500;
        ctx.body = {
            message: err.message || 'Something going wrong!'
        }
    }
}
