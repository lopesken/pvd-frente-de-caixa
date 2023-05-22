const { Router } = require('express');
const tokenUsuarioLogado = require('../middlewares/tokenAutenticacao')

const rotas = Router();

const { validarDuplicidadeCliente, validarId } = require('../middlewares/validarCliente')
const {
    validarCorpoRequisicaoCPF: cpf,
    validarCorpoRequisicaoNome: nome,
    validarCorpoRequisicaoEmail: email } = require('../middlewares/validarBody')

const { listarClientes, cadastrarCliente, detalharCliente, editarDadosCliente } = require('../controllers/clientControllers')

rotas.use(tokenUsuarioLogado)

rotas.post("/", nome, email, cpf, validarDuplicidadeCliente, cadastrarCliente)
rotas.get("/:id", validarId, detalharCliente)
rotas.get("/", listarClientes)
rotas.put("/:id", validarId, nome, email, cpf, validarDuplicidadeCliente, editarDadosCliente)

module.exports = rotas