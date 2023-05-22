const { Router } = require('express');

const rotas = Router();
const tokenUsuarioLogado = require('../middlewares/tokenAutenticacao')

const { verificarDuplicidadeDeEmailAtualizar, validarEmail } = require('../middlewares/validarUsuario')
const {
    validarCorpoRequisicaoEmail: temEmail,
    validarCorpoRequisicaoSenha: temSenha,
    validarCorpoRequisicaoNome: temNome } = require('../middlewares/validarBody')

const { cadastrar, detalhar, editarUsuarioLogado } = require('../controllers/usuarioControllers')

rotas.post("/", temNome, temEmail, temSenha, validarEmail, cadastrar)

rotas.use(tokenUsuarioLogado)

rotas.get("/", tokenUsuarioLogado, detalhar)
rotas.put("/", temNome, temEmail, temSenha, verificarDuplicidadeDeEmailAtualizar, editarUsuarioLogado)

module.exports = rotas