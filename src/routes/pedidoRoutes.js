const { Router } = require('express');

const rotas = Router();

const tokenUsuarioLogado = require('../middlewares/tokenAutenticacao')
const { validarId, verificarSeExistePedidos, cliente_id_query } = require('../middlewares/validarCliente')
const { bodyProduto } = require('../middlewares/validarBody')
const { validarSeExisteProduto, quantidade_produto } = require('../middlewares/validarProduto')

const { cadastrar_pedido, listar_pedidos } = require('../controllers/pedidoControllers')

rotas.use(tokenUsuarioLogado)

rotas.post("/", validarId, bodyProduto, validarSeExisteProduto, quantidade_produto, cadastrar_pedido)
rotas.get('/', verificarSeExistePedidos, cliente_id_query, listar_pedidos)


module.exports = rotas