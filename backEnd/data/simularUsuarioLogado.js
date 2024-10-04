const loginUsuario = require("../resolvers/Mutations/Usuarios/mutation/logarUsuario_mutation")

const dados = {
    email: "developer@xxxx.com",
    senha: "Dev@123"
}

module.exports = async req => {

    const { token } = await loginUsuario(dados)
    req.headers = {
        authorization: `Bearer ${token}`

    }

}
