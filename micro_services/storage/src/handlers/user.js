const dbClient = require('../db-client')

exports.createNewUser = async (ctx) => {
    ctx.body = await dbClient.user.create({
        data: ctx.request.body
    })
}

exports.getUserByEmail = async (ctx) => {
    const user = await dbClient.user.findUnique({
        where: { email: ctx.request.body.email },
        select: {
            id: true,
            passwordHash: true,
        },
    })
    ctx.body = { user }
}

exports.getUserList = ({ limit = 50 }) => {
    return dbClient.user.findMany({
        take: limit
    })
}
