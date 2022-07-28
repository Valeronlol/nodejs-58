const { got } = require('got-cjs')
const { storageUrl } = require('../constants')
const localStorage = require('../utils/local-storage')

const instance = got.extend({
    hooks: {
        beforeRequest: [
            (options) => {
                const store = localStorage.getStore()
                if (store) {
                    options.headers['X-TRACE-ID'] = store.get('traceId')
                }
            }
        ]
    }
});

exports.getProductsList = () => {
    return instance.get(`${storageUrl}/product`, { searchParams: { limit: 10 } }).json()
}

exports.addProduct = (json) => {
    return instance.post(`${storageUrl}/product`, { json }).json()
}

exports.getUserByEmail = (email) => {
    return instance.post(`${storageUrl}/login`, { json: { email } })
        .json()
        .then(data => data ? data.user : null)
}

exports.createNewUser = (json) => {
    return instance.post(`${storageUrl}/user`, { json }).json()
}

exports.updateProductImage = (productId, imagePath) => {
    return instance.put(`${storageUrl}/product/${productId}/image`, { json: { imagePath } }).json()
}
