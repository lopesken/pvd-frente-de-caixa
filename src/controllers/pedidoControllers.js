const { poolQuery } = require('../connections/conexao');
const transport = require('../connections/mail');

const cadastrar_pedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;
    try {
        let valor_total_pedido = 0

        for (const produto of pedido_produtos) {
            const select = `SELECT * FROM produtos WHERE id = $1`
            const result = await poolQuery(select, [produto.produto_id])

            if (produto.quantidade_produto < result.rows[0].quantidade_estoque) {
                valor_total_pedido += result.rows[0].valor * produto.quantidade_produto;

                const update = `update produtos set quantidade_estoque = $1 where id = $2`
                let resultado = result.rows[0].quantidade_estoque - produto.quantidade_produto
                await poolQuery(update, [resultado, result.rows[0].id])

            } else {
                return res.status(404).json({ mensagem: `Quantidade em estoque insuficiente` });
            }
        }

        const insert_pedido = "INSERT INTO pedidos (cliente_id, observacao, valor_total) VALUES ($1, $2, $3) RETURNING id";
        const resultado = await poolQuery(insert_pedido, [cliente_id, observacao, valor_total_pedido]);
        const pedido_id = resultado.rows[0].id;

        const insert_pedido_produtos = `INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade_produto, valor_produto) VALUES ($1, $2, $3, $4)`;

        for (const pedidoProduto of pedido_produtos) {
            const { produto_id, quantidade_produto } = pedidoProduto;
            const select = `SELECT valor FROM produtos WHERE id = $1`
            const result = await poolQuery(select, [produto_id])
            const valorProduto = result.rows[0].valor;

            await poolQuery(insert_pedido_produtos, [pedido_id, produto_id, quantidade_produto, valorProduto]);
        }

        const selectEmail = `select email from clientes where id = $1`
        const resultadoEmail = await poolQuery(selectEmail, [cliente_id])

        transport.sendMail({
            from: `${process.env.MAIL_NAME} <${process.env.MAIL_FROM}>`,
            to: `${resultadoEmail.rows[0].email}`,
            subject: `API DBE IFOOD`,
            text: `Pedido realizado com sucesso!`
        })

        return res.status(201).json({ mensagem: `Pedido realizado com sucesso!` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` });
    }
};

const listar_pedidos = async (req, res) => {
    const cliente_id = req.query.cliente_id;

    try {
        let valorTotalPedidos = 0

        let pedido_produtos = []

        const select = ` SELECT p.id, p.valor_total, p.observacao, p.cliente_id, 
        pp.id as pedido_produto_id , pp.quantidade_produto, pp.valor_produto, pp.pedido_id,  pp.produto_id
        FROM pedido_produtos pp
        INNER JOIN pedidos p ON p.id = pp.pedido_id
        WHERE p.cliente_id = $1;`

        const { rows, rowCount } = await poolQuery(select, [cliente_id]);

        if (!rowCount) {
            return res.status(404).json({ mensagem: `Não há pedidos registrado para o cliente informado` });
        }

        rows.forEach((pedido) => {
            let { pedido_produto_id, quantidade_produto, valor_produto, pedido_id, produto_id } = pedido;

            pedido_produtos.push({ id: pedido_produto_id, quantidade_produto, valor_produto, pedido_id, produto_id });

            valorTotalPedidos += valor_produto * quantidade_produto;
        });

        const pedido = {
            id: rows[0].id,
            valor_total: valorTotalPedidos,
            observacao: rows[0].observacao,
            cliente_id: rows[0].cliente_id
        }

        return res.status(200).json({ pedido, pedido_produtos });
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` });
    }
};

module.exports = {
    cadastrar_pedido,
    listar_pedidos
}
