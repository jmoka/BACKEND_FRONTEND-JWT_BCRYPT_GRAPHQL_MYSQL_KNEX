require('module-alias/register')
const db = require("@data/db")
const loginUsuario = require("./mutation/logarUsuario_mutation")
const { novoUsuario } = require("./mutation/novoUsuario_mutation")
const { alterarUsuario } = require("./mutation/atualizarUsuario_mutation")
const { excluirUsuario } = require("./mutation/excluirUsuario_mutation")
const { extrairTokenContext, extrairDecoded } = require("@data/extrairContext")
module.exports = {
    novoUsuario(_, { user }, ctx) {
        return novoUsuario(user);
    },
    alterarUsuario(_, { user, filtro }) {
        return alterarUsuario(user, filtro)
    },
    excluirUsuario(_, { filtro }) {
        return excluirUsuario(filtro)
    },
    loginUsuario(_, { dados }, ctx) {
        const token = extrairTokenContext(ctx)
        const decodedExtraido = extrairDecoded(token)
        const perfil = decodedExtraido.perfil.nome
        console.log("Perfil = " + decodedExtraido.perfil.nome);
        if (perfil !== "mast") {
            console.log("Não pode Logar diferente de Master");
            throw new Error("Não pode Logar");
        }

        console.log(decodedExtraido);




        // if (!decodedExtraido && !decodedExtraido.perfil.nome === "Master") {
        //     console.log("Usuario diferente de Master");
        //     throw new Error("Erro não pode Acessar")
        // }

        return loginUsuario(dados);
    }
}