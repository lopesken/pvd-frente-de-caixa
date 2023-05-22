const { Router } = require('express');
const tokenUsuarioLogado = require('../middlewares/tokenAutenticacao')

const rotas = Router();

const { validarReqBodyProduto, validarSeExisteProduto, validarSeExisteCategoria, validarVinculoProdutoPedido } = require('../middlewares/validarProduto')

const { cadastrarProduto, editarDadosProduto, listarProdutos, detalharProduto, excluirProduto } = require('../controllers/produtoControllers')

rotas.use(tokenUsuarioLogado)

rotas.post("/", validarReqBodyProduto, validarSeExisteCategoria, cadastrarProduto)
rotas.put("/:id", validarReqBodyProduto, validarSeExisteProduto, validarSeExisteCategoria, editarDadosProduto)
rotas.get("/", validarSeExisteCategoria, listarProdutos)
rotas.get("/:id", validarSeExisteProduto, detalharProduto)
rotas.delete("/:id", validarSeExisteProduto, validarVinculoProdutoPedido, excluirProduto)

module.exports = rotas