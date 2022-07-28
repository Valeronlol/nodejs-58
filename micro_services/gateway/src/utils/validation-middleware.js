const get = require('lodash/get')
const { AppError } = require('./app-errors')

module.exports = (schema) => {
    if (!schema) {
        throw new Error('Validation scheme is required!')
    }

    return (req, res, next) => {
        const { error } = schema.validate(req.body)

        if (error) {
            const errorMessage = get(error, 'details', [])
                .reduce((acc, { message }) => {
                    if (message) {
                        acc += message
                    }
                    return acc
                }, '')
            return next(new AppError({ message: errorMessage, code: 400 }))
        }

        next()
    }
}
