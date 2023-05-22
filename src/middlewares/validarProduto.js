const { poolQuery } = require('../connections/conexao')

const validarSeExisteCategoria = async (req, res, next) => {
    const { categoria_id } = req.body
    const { categoria_id: categoria } = req.query

    try {
        if (categoria_id) {
            const select = "SELECT * FROM categorias WHERE id = $1"
            const resultado = await poolQuery(select, [categoria_id])

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Categoria não encontrada" })
            }
        }

        if (categoria) {
            const select = 'SELECT * FROM categorias WHERE id = $1'
            const resultado = await poolQuery(select, [categoria])

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Categoria não encontrada" })
            }
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const validarReqBodyProduto = (req, res, next) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body

    if (!descricao) {
        return res.status(400).json({ mensagem: "Informe a descrição" })
    }

    if (!quantidade_estoque && quantidade_estoque <= 0) {
        return res.status(400).json({ mensagem: "Informe a quantidade_estoque" })
    }

    if (!valor && valor <= 0) {
        return res.status(400).json({ mensagem: "Informe o valor" })
    }

    if (!categoria_id) {
        return res.status(400).json({ mensagem: "Informe a categoria_id" })
    }

    next()
}

const validarSeExisteProduto = async (req, res, next) => {
    const { id } = req.params
    const { id: identificador } = req.body

    try {
        if (id) {
            const select = "SELECT * FROM produtos WHERE id = $1"
            const resultado = await poolQuery(select, [id])

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Não foi possível encontrar um produto cadastrado para o id informado." })
            }
        }

        if (identificador) {
            const select = 'SELECT * FROM produtos WHERE id = $1'
            const resultado = await poolQuery(select, [identificador])

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Não foi possível encontrar um produto cadastrado para o id informado." })
            }
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const quantidade_produto = async (req, res, next) => {
    const pedido_produtos = req.body.pedido_produtos
    const produto_id = pedido_produtos[0].produto_id
    const quantidade_produto = pedido_produtos[0].quantidade_produto

    try {
        const select = "SELECT quantidade_estoque FROM produtos WHERE id = $1"
        const resultado = await poolQuery(select, [produto_id])

        if (resultado.rows[0].quantidade_estoque < quantidade_produto) {
            return res.status(404).json({ mensagem: "Não há produto o suficiente em estoque" })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const validarVinculoProdutoPedido = async (req, res, next) => {
    const { id } = req.params

    try {
        const select = "SELECT * FROM pedido_produtos WHERE produto_id = $1"
        const resultado = await poolQuery(select, [id])

        if (resultado.rowCount) {
            res.status(400).json({ mensagem: "Não será possível seguir com a exclusão. O produto informado esta vinculado a um ou mais pedidos registrados." })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = {
    validarReqBodyProduto,
    validarSeExisteProduto,
    validarSeExisteCategoria,
    quantidade_produto,
    validarSeExisteCategoria,
    validarVinculoProdutoPedido
}