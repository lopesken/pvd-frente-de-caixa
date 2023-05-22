require('dotenv').config()
const app = require('./index')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}
    \nhttp://localhost:${PORT}`);
})