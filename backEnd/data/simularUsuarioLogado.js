const loginUsuario = require("../resolvers/Mutations/Usuarios/mutation/logarUsuario_mutation")

const dev = {
    email: "dev@jotaempresas.com",
    senha: "dev@123"
}

const admin = {
    email: "admin@jotaempresas.com",
    senha: "admin@123"
}

const master = {
    email: "master@jotaempresa.com",
    senha: "Master@123"
}


module.exports = async req => {

    const { token } = await loginUsuario(master)
    req.headers = {
        authorization: `Bearer ${token}`

    }


}
