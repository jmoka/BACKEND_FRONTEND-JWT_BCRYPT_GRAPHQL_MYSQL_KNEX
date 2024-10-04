const db = require("@data/db")
const validarRotulo = require("@data/validacoes/ValidarPerfis/validarRotulo")
const validarId = require("@data/validacoes/ValidarPerfis/validarID")
const validarNome = require("@data/validacoes/ValidarPerfis/validarNome")
module.exports = {
    async excluirPerfil(filtro) {
        const { id, nome, rotulo } = filtro;
        if (id === 2 || id === 1 || nome === "master" || nome === "admin" || rotulo === "Master" || rotulo === "Admin") {
            console.log("Usuário não pode ser deletado");
            throw new Error("Usuário não pode ser deletado");
        }
        let perfilEncontrado;
        if (id) {
            await validarId(id);
            perfilEncontrado = db("perfis").where({ id }).first()
            if (!perfilEncontrado) {
                throw new Error(`Perfil com Id ${id} não encontrado!!`);
            }
            await db("perfis").where({ id }).first().del()
        } else if (nome) {
            await validarNome(nome);
            const perfilEncontrado = await db("perfis").where({ nome }).first()
            if (!perfilEncontrado) {
                throw new Error(`Perfil com Nome ${nome} não encontrado!!!`);
            }
            await db("perfis").where({ nome }).first().del()
        } else if (rotulo) {
            await validarRotulo(rotulo),
                perfilEncontrado = await db("perfis").where({ rotulo }).first()
            if (!perfilEncontrado) {
                throw new Error(`Perfil com rotulo ${rotulo} não encontrado!!!`);
            }
            await db("perfis").where({ rotulo }).first().del()
        }
        const retorno = {
            id: perfilEncontrado.id,
            nome: perfilEncontrado.nome,
            rotulo: perfilEncontrado.rotulo,
        }
        console.log(`Usuário com ID: ${perfilEncontrado.id} e Nome: ${perfilEncontrado.nome} Deletado com sucesso!! `);
        return retorno;
    }
}
//----------------------------------
// consultar por ID
//------------------------------
// mutation{
//     excluirPerfil(
//       filtro:{
//         id:5
//       }
//   ){
//     id
//     nome
//       rotulo
//     }
//   }
//----------------------------------
// consultar por NOME
//------------------------------
// mutation{
//     excluirPerfil(
//       filtro:{
//         nome:"frontEnsd"
//       }
//   ){
//     id
//     nome
//       rotulo
//     }
//   }
//----------------------------------
// consultar por ROTULO
//------------------------------
// mutation{
//     excluirPerfil(
//       filtro:{
//         rotulo:"Webd Dessigner"
//       }
//   ){
//     id
//     nome
//       rotulo
//     }
//   }