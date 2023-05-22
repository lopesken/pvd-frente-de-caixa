const { poolQuery } = require('../connections/conexao');
const deletarArquivo = require('../utils/arquivosUtils');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body

    try {
        const insert = "INSERT INTO produtos (descricao, quantidade_estoque, valor, categoria_id, produto_imagem) VALUES ($1, $2, $3, $4, $5) RETURNING *"

        const resultado = await poolQuery(insert, [descricao, quantidade_estoque, valor, categoria_id, produto_imagem])

        if (!resultado.rowCount) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o produto" })
        }

        const produtoCadastrado = resultado.rows[0]

        return res.status(201).json(produtoCadastrado)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const editarDadosProduto = async (req, res) => {
    const { id } = req.params
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body

    try {
        const select = "SELECT * FROM produtos WHERE id = $1"
        const { rows } = await poolQuery(select, [id])

        const url = rows[0].produto_imagem

        if (!produto_imagem) {
            if (url) {
                deletarArquivo(url)
            }
        } else {
            if (url != produto_imagem) {
                deletarArquivo(url)
            }
        }

        const update = "UPDATE produtos SET descricao = $1, quantidade_estoque = $2, valor = $3, categoria_id = $4, produto_imagem = $5 WHERE id = $6 RETURNING *"

        const resultado = await poolQuery(update, [descricao, quantidade_estoque, valor, categoria_id, produto_imagem, id])

        if (!resultado.rowCount) {
            return res.status(400).json({ mensagem: "Não foi possível editar os dados deste produto" })
        }

        const dadosProduto = resultado.rows[0]

        return res.status(200).json(dadosProduto)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query

    try {
        if (!categoria_id) {
            const resultado = await poolQuery("SELECT * FROM produtos")

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Não há produtos cadastrados" })
            }

            return res.status(200).json(resultado.rows)
        }

        const select = "SELECT * FROM produtos WHERE produtos.categoria_id = $1"
        const resultado = await poolQuery(select, [categoria_id])

        if (!resultado.rowCount) {
            return res.status(404).json({ mensagem: "Não há produtos vinculados a categoria informada" })
        }

        return res.status(200).json(resultado.rows)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const detalharProduto = async (req, res) => {
    const { id } = req.params

    try {
        const select = "SELECT * FROM produtos WHERE id = $1"
        const resultado = await poolQuery(select, [id])

        const dadosProduto = resultado.rows[0]

        return res.status(200).json(dadosProduto)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const excluirProduto = async (req, res) => {
    const { id } = req.params

    try {
        const select = "SELECT * FROM produtos WHERE id = $1"
        const resultado = await poolQuery(select, [id])

        const url = resultado.rows[0].produto_imagem

        if (url) {
            deletarArquivo(url)
        }

        const del = "DELETE FROM produtos WHERE id = $1"

        await poolQuery(del, [id])

        return res.status(200).json({ mensagem: "Produto excluído" })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = {
    cadastrarProduto,
    editarDadosProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
}