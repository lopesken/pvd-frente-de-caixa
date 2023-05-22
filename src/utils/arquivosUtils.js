require('dotenv').config();
const s3 = require('../connections/aws-s3')

const deletarArquivo = async (url) => {
    const path = url.split(`${process.env.BACKBLAZE_BUCKET}/`)

    const keyPath = path.slice(1).join()

    await s3.deleteObject({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: keyPath
    }).promise()
}

module.exports = deletarArquivo
