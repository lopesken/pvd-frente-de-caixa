const { poolQuery } = require('../connections/conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {
        const insert = "INSERT INTO clientes (nome, email, cpf, cep, rua, numero, bairro, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *"

        const resultado = await poolQuery(insert, [nome, email, cpf, cep, rua, numero, bairro, cidade, estado])

        if (resultado.rowCount == 0) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o cliente" })
        }

        const clienteCadastrado = resultado.rows[0]

        return res.status(201).json(clienteCadastrado)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` })
    }
}

const detalharCliente = async (req, res) => {
    const { id } = req.params

    try {
        const select = "SELECT * FROM clientes WHERE id = $1"
        const resultado = await poolQuery(select, [id])

        if (resultado.rowCount == 0) {
            return res.status(404).json({ mensagem: "Não há clientes cadastrados" })
        }

        const dadosCliente = resultado.rows[0]

        return res.status(200).json(dadosCliente)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` })

    }
}

const editarDadosCliente = async (req, res) => {
    const { id } = req.params
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {
        const update = "UPDATE clientes SET nome = $1, email = $2, cpf = $3, cep = $4, rua = $5, numero = $6, bairro = $7, cidade = $8, estado = $9 WHERE id = $10 RETURNING *"

        const resultado = await poolQuery(update, [nome, email, cpf, cep, rua, numero, bairro, cidade, estado, id])

        if (!resultado.rowCount) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar os dados do cliente." })
        }

        const dadosAtualizados = resultado.rows[0]

        return res.status(201).json(dadosAtualizados)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` })
    }
}

const listarClientes = async (req, res) => {

    try {
        const select = "SELECT * FROM clientes"
        const resultado = await poolQuery(select)

        if (resultado.rowCount == 0) {
            return res.status(404).json({ mensagem: "Não há clientes cadastrados" })
        }

        const listaClientes = resultado.rows

        return res.status(200).json(listaClientes)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })

    }
}

module.exports = {
    listarClientes,
    cadastrarCliente,
    detalharCliente,
    editarDadosCliente
}