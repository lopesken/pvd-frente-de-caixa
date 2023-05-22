const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolQuery } = require('../connections/conexao');

const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const insert = "INSERT INTO usuarios (nome,email,senha) VALUES ($1,$2,$3) RETURNING id,nome,email"
        const resultado = await poolQuery(insert, [nome, email, senhaCriptografada])

        if (resultado.rowCount == 0) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o usuário" })
        }

        return res.status(201).json(resultado.rows[0])
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` })
    }
}

const login = async (req, res) => {
    const { id } = req.usuario

    try {
        const token = jwt.sign({ id: id }, process.env.SENHAJWT, { expiresIn: "1h" })

        return res.status(200).json({ id, token })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const detalhar = async (req, res) => {
    res.status(200).json(req.usuarioLogado)
}

const editarUsuarioLogado = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuarioLogado

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const update = "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4";

        await poolQuery(update, [nome, email, senhaCriptografada, id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` })
    }
}

module.exports = {
    cadastrar,
    login,
    detalhar,
    editarUsuarioLogado
}