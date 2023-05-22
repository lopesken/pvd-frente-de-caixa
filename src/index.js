const express = require('express')

const app = express()

const categoriasRoutes = require('./routes/categoriaRoutes')
const usuarioRoutes = require('./routes/usuarioRouters')
const loginRoutes = require('./routes/loginRoutes')
const produtoRoutes = require('./routes/produtoRoutes')
const clientRoutes = require('./routes/clientRoutes')
const pedidoRoutes = require('./routes/pedidoRoutes')
const arquivosRoutes = require('./routes/arquivosRouters')

app.use(express.json())

app.use('/categoria', categoriasRoutes)
app.use('/login', loginRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/produto', produtoRoutes)
app.use('/cliente', clientRoutes)
app.use('/pedido', pedidoRoutes)
app.use('/arquivo', arquivosRoutes)

module.exports = app