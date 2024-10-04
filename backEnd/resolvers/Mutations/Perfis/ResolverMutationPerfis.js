const { novoPerfil } = require("./mutation/novoPerfil_mutation")
const { alterarPerfil } = require("./mutation/alterarPerfil_mutation")
const { excluirPerfil } = require("./mutation/excluirPerfil_mutation")

module.exports = {

    async novoPerfil(_, { perfil }) {
        return novoPerfil(perfil)
    },
    async alterarPerfil(_, { perfil, filtro }) {
        return alterarPerfil(perfil, filtro)
    },

    async excluirPerfil(_, { filtro }) {
        return excluirPerfil(filtro)
    },
}