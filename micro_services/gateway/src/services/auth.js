const { decode, verify, sign } = require('jsonwebtoken')
const { createHash } = require('crypto')
const { jwtSecret } = require('../constants')
const { AppError } = require('../utils/app-errors')

exports.createHash = (str) => {
    const hash = createHash('sha512')
    hash.update(str)
    return hash.digest('hex')
}

exports.createJwtTokenAsync = (payload = {}) => new Promise((resolve, reject) => {
    const options = {
        expiresIn: '365d'
    }
    sign(payload, jwtSecret, options,  (err, token) => {
        if (err) {
            reject(err)
        } else {
            resolve(token)
        }
    })
})

exports.checkAuth = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        throw new AppError({ message: 'Unauthorized. Token is required.', code: 401 })
    }
    const [_, token] = authorization.split(' ')
    verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            next(new AppError({ message: `Unauthorized: ${err.message}`, code: 401 }))
        } else {
            req.userTokenData = decoded
            next()
        }
    })
}
