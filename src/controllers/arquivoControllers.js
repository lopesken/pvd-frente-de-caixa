require('dotenv').config();
const s3 = require('../connections/aws-s3')

const uploadArquivos = async (req, res) => {
    const { file } = req

    if (!file) {
        return res.status(400).json({ mensagem: `É obrigatório o envio de um arquivo de imagem.` })
    }

    const nomeFormatado = file.originalname.replaceAll(" ", "-")
    const nomeDaImagem = `produtos/imagem/${new Date().getTime()}.${nomeFormatado}`

    try {
        const arquivo = await s3.upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: nomeDaImagem,
            Body: file.buffer,
            ContentType: file.mimetype
        }).promise()

        return res.status(200).json({
            url: arquivo.Location,
            path: arquivo.Key
        })

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor ${error.message}` });
    }
}

const listarArquivos = async (req, res) => {

    try {
        const arquivos = await s3.listObjects({
            Bucket: process.env.BACKBLAZE_BUCKET
        }).promise()

        const files = arquivos.Contents.map((file) => {
            return {
                url: `https://${process.env.ENDPOINT_S3}/${process.env.BACKBLAZE_BUCKET}/${file.Key}`,
                path: file.Key
            }
        })

        return res.status(200).json(files)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor ${error.message}` })
    }
}

module.exports = {
    uploadArquivos,
    listarArquivos
}
