exports.createNewUser = {
    type: 'object',
    properties: {
        passwordHash: {
            type: 'string',
            minLength: 20,
        },
        email: {
            type: 'string',
            format: 'email',
        },
    },
    required: ['passwordHash', 'email'],
    additionalProperties: true,
}
