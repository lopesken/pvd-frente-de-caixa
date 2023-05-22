const { Router } = require('express');

const rotas = Router();

const { validacaoEmailSenha } = require('../middlewares/validarUsuario')
const { validarCorpoRequisicaoEmail: temEmail, validarCorpoRequisicaoSenha: temSenha } = require('../middlewares/validarBody')

const { login } = require('../controllers/usuarioControllers')

rotas.post("/", temEmail, temSenha, validacaoEmailSenha, login)

module.exports = rotas