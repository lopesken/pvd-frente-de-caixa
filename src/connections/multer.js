const multer = require('multer');

const upload = multer({});

const singleUpload = (arquivo) => upload.single(arquivo)

module.exports = {
    singleUpload
}