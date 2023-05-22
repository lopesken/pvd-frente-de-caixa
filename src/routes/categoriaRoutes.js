const { Router } = require('express');

const rotas = Router();

const { listarCategorias } = require('../controllers/categoriaControllers')

rotas.get("/", listarCategorias)

module.exports = rotas