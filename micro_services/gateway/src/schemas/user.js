const Joi = require('joi')

exports.createUser = Joi.object({
    password: Joi.string().min(8).max(20).required(),
    email: Joi.string().email().required(),
    name: Joi.string().min(2).optional(),
})

exports.authenticateUser = Joi.object({
    password: Joi.string().min(8).max(20).required(),
    email: Joi.string().email().required(),
})
