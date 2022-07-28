const formidable = require('formidable')
const { nanoid } = require('nanoid')

exports.uploadFileToFileSys = (req) => new Promise(((resolve, reject) => {
    formidable({
        uploadDir: `${process.cwd()}/public/images/`,
        multiples: true,
        filename: ($, _, {originalFilename}) => `${nanoid()}_${originalFilename}`,
    })
        .parse(req, (err, _, { image }) => {
            err ? reject(err) : resolve(`/images/${image.newFilename}`)
        })
}))
