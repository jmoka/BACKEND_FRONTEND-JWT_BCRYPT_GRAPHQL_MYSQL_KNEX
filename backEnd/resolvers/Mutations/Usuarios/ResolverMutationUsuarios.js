
require('module-alias/register')
const db = require("@data/db")
const loginUsuario = require("./mutation/logarUsuario_mutation")
const { novoUsuario } = require("./mutation/novoUsuario_mutation")
const { alterarUsuario } = require("./mutation/atualizarUsuario_mutation")
const { excluirUsuario } = require("./mutation/excluirUsuario_mutation")

module.exports = {
    novoUsuario(_, { user }) {
        return novoUsuario(user);
    },

    alterarUsuario(_, { user, filtro }) {
        return alterarUsuario(user, filtro)
    },

    excluirUsuario(_, { filtro }) {
        return excluirUsuario(filtro)
    },

    loginUsuario(_, { dados }) {
        return loginUsuario(dados)
    }

}