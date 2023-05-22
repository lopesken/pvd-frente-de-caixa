const { poolQuery } = require('../connections/conexao');

const validarDuplicidadeCliente = async (req, res, next) => {
    const { email, cpf } = req.body

    try {
        const select = "SELECT * FROM clientes WHERE email = $1 or cpf = $2"
        const resultado = await poolQuery(select, [email, cpf])

        if (resultado.rowCount) {
            return res.status(400).json({ mensagem: "O email ou cpf informado já está sendo utilizado por outro usuário." })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const validarId = async (req, res, next) => {
    const { id } = req.params
    const { id: identificador } = req.body

    try {
        if (id) {
            const select = "SELECT * FROM clientes WHERE id = $1"
            const resultado = await poolQuery(select, [id])

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Não foi possível encontrar o cliente cadastrado com o id informado." })
            }
        }

        if (identificador) {
            const select = "SELECT * FROM clientes WHERE id = $1"
            const resultado = await poolQuery(select, [identificador])

            if (!resultado.rowCount) {
                return res.status(404).json({ mensagem: "Não foi possível encontrar o cliente cadastrado com o id informado." })
            }
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const verificarSeExistePedidos = async (req, res, next) => {
    const { cliente_id } = req.query;

    try {
        const query = 'SELECT * FROM pedidos'
        const { rows, rowCount } = await poolQuery(query)

        if (!rowCount) {
            return res.status(404).json({ mensagem: 'Não há registros de pedidos por aqui' })
        }

        if (!cliente_id) {
            return res.status(200).json({ pedidos: rows })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const cliente_id_query = async (req, res, next) => {
    const { cliente_id } = req.query;

    try {
        const select = 'SELECT * FROM clientes WHERE id = $1'
        const result = await poolQuery(select, [cliente_id])

        if (!result.rowCount) {
            return res.status(404).json({ mensagem: 'Não foi possível encontrar o cliente cadastrado com o id informado.' })
        }

        next()
    }
    catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })

    }
}

module.exports = {
    validarDuplicidadeCliente,
    validarId,
    verificarSeExistePedidos,
    cliente_id_query
}