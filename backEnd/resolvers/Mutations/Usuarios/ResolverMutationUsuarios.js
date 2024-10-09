require('module-alias/register')
const db = require("@data/db")
const loginUsuario = require("./mutation/logarUsuario_mutation")
const { novoUsuario } = require("./mutation/novoUsuario_mutation")
const { alterarUsuario } = require("./mutation/atualizarUsuario_mutation")
const { excluirUsuario } = require("./mutation/excluirUsuario_mutation")
const { extrairObjDecoder } = require("@data/extrairContext")


module.exports = {

    novoUsuario(_, { user }, ctx) {
        return novoUsuario(user, ctx);
    },

    alterarUsuario(_, { user, filtro }) {
        return alterarUsuario(user, filtro)
    },


    excluirUsuario(_, { filtro }) {
        return excluirUsuario(filtro)
    },

    loginUsuario(_, { dados }, ctx) {
        return loginUsuario(dados, ctx);
    }
}