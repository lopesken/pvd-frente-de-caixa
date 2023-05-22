const jwt = require('jsonwebtoken');
const { poolQuery } = require('../connections/conexao');

const tokenUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Usuario não autenticado" })
    }

    try {
        const token = authorization.split(' ')[1]

        const { id } = await jwt.verify(token, process.env.SENHAJWT)

        const select = "SELECT * FROM usuarios WHERE id = $1"
        const resultado = await poolQuery(select, [id])

        if (!resultado.rowCount) {
            return res.status(401).json({ mensagem: "Usuario não autenticado" })
        }

        const { senha, ...usuario } = resultado.rows[0]

        req.usuarioLogado = usuario

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: "Para acessar esse recurso, informe um token de autenticação válido." })
    }
}

module.exports = tokenUsuarioLogado