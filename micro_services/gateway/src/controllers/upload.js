const { updateProductImage } = require('../services/data-client')
const { uploadFileToFileSys } = require('../services/upload')

exports.uploadImage = async (req, res) => {
    const productId = parseInt(req.params.id)
    const imagePath = await uploadFileToFileSys(req)
    await updateProductImage(productId, imagePath)
    res.send({ imagePath })
}
