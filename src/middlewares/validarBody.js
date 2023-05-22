const validarCorpoRequisicaoEmail = (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ mensagem: "Informe o e-mail" })
    }

    next()
}

const validarCorpoRequisicaoSenha = (req, res, next) => {
    const { senha } = req.body

    if (!senha) {
        return res.status(400).json({ mensagem: "Informe a senha" })
    }

    next()
}

const validarCorpoRequisicaoNome = (req, res, next) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: "Informe o nome" })
    }

    next()
}

const validarCorpoRequisicaoCPF = (req, res, next) => {
    const { cpf } = req.body
    const cpfString = String(cpf)

    if (!cpf) {
        return res.status(400).json({ mensagem: "Informe o CPF" })
    } else if (cpfString.length != 11) {
        return res.status(400).json({ mensagem: "CPF Inválido" })
    }

    next()
}

const bodyProduto = async (req, res, next) => {
    const pedido_produtos = req.body.pedido_produtos
    const produto_id = pedido_produtos[0].produto_id
    const quantidade_produto = pedido_produtos[0].quantidade_produto

    if (!produto_id) {
        return res.status(400).json({ mensagem: "Informe o id do Produto" })
    }

    if (!quantidade_produto) {
        return res.status(400).json({ mensagem: "Informe a quantidade de produtos" })
    }

    next()
}

module.exports = {
    validarCorpoRequisicaoSenha,
    validarCorpoRequisicaoNome,
    validarCorpoRequisicaoEmail,
    validarCorpoRequisicaoCPF,
    bodyProduto
}