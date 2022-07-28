class AppError extends Error {
    constructor({ message = 'Something going wrong', code = 500 }) {
        super();
        this.message = message
        this.code = code
    }
}

module.exports = {
    AppError,
}
