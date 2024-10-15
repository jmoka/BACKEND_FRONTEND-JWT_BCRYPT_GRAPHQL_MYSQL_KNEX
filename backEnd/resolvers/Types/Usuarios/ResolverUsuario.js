//const { usuarios, perfis } = require('../../../data/db')
require('module-alias/register')
const db = require("@data/db")
const TodosUsuarios = require("./consultar/todosUsuarios.js")
const UsuarioNome = require("./consultar/usuarioNome.js")
const { UsuarioID } = require("./consultar/usuarioID.js")
const UsuarioLogado = require("./consultar/loginUsuario.js")
const UsuarioEmail = require("./consultar/usuarioEmail.js")


module.exports = {
    usuarios() {
             
        return TodosUsuarios();
    },
    usuarioID(_, { id }) {
        return UsuarioID(id)
    },
    usuarioNome(_, { nome }) {
        return UsuarioNome(nome)
    },

    usuarioEmail(_, { email }) {
        return UsuarioEmail(email)
    },

    UsuarioLogado(_, { dados }) {
        return UsuarioLogado(dados)
    }

}