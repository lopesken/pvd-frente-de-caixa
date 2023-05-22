const { poolQuery } = require('../connections/conexao');

const listarCategorias = async (req, res) => {
    try {
        const select = "SELECT * FROM categorias"
        const resultado = await poolQuery(select)

        if (resultado.rowCount == 0) {
            return res.status(404).json({ mensagem: "Não temos nada na lista de categorias." })
        }

        const listaCategorias = resultado.rows

        return res.status(200).json(listaCategorias)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` })
    }
}

module.exports = {
    listarCategorias
}