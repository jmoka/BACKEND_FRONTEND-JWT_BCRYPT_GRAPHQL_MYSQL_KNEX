const db = require("@data/db");
module.exports = {
    async alterarPerfil(perfil, filtro) {
        const { id, nome, rotulo } = filtro;

        let perfilEncontrado;
        const atualizacoes = {
            nome: perfil.nome,
            rotulo: perfil.rotulo,
        };
        try {
            if (id) {
                perfilEncontrado = await db("perfis").where({ id }).first()
                if (!idEnonstrado || id === 1 || id === 2) {
                    console.log(`Perfil com Id ${id} não encontrado ou não pode ser deletado!!!`);
                    new Error(`Perfil com Id ${id} não encontrado ou não pode ser deletado!!!`);
                }
                const novosDados = {
                    nome: perfil.nome,
                    rotulo: perfil.rotulo
                }
                await db("perfis")
                    .where({ id })
                    .update(novosDados)
                const perfilAtualizado = await db("perfis").where({ id }).first()
                return perfilAtualizado
            } else if (nome) {
                const nomeEnonstrado = await db("perfis").where({ nome }).first()
                if (!nomeEnonstrado) {
                    throw new Error(`Perfil com nome ${nome} não encontrado!!!`);
                }
                const novosDados = {
                    nome: perfil.nome,
                    rotulo: perfil.rotulo
                }
                await db("perfis")
                    .where({ nome })
                    .update(novosDados)
                const perfilAtualizado = await db("perfis").where({ nome }).first()
                return perfilAtualizado
            } else if (rotulo) {
                const rotuloEnonstrado = await db("perfis").where({ rotulo }).first()
                if (!rotuloEnonstrado) {
                    throw new Error(`Perfil com rotulo ${rotulo} não encontrado!!!`);
                }
                const novosDados = {
                    nome: perfil.nome,
                    rotulo: perfil.rotulo
                }
                await db("perfis")
                    .where({ rotulo })
                    .update(novosDados)
                const perfilAtualizado = await db("perfis").where({ rotulo }).first()

                console.log(`Perfil com ID:${retorno.id} e Nome:${retorno.nome} criado com Sucesso!!`);
                return perfilAtualizado
            }




        } catch (error) {

        }




    }
}
//----------------------------------
// Alterar por ID
//------------------------------
// mutation{
//     alterarPerfil(
//         perfil:{
//         nome:"LOOdK"
//         rotulo:"FLdAY"
//       }
//       filtro:{
//         id:8
//       }
//     )
//     {
//       id
//       nome
//       rotulo
//   }
//     }
//----------------------------------
// Alterar por NOME
//------------------------------
// mutation{
//     alterarPerfil(
//         perfil:{
//         nome:"LOOdK"
//         rotulo:"FLdddddddAY"
//       }
//       filtro:{
//         nome:"LOOdK"
//       }
//     )
//     {
//       id
//       nome
//       rotulo
//   }
//     }
//----------------------------------
// Alterar por ROTULO
//------------------------------
// mutation{
//     alterarPerfil(
//         perfil:{
//         nome:"zeca"
//         rotulo:"FLdddddddAY"
//       }
//       filtro:{
//         rotulo:"FLdddddddAY"
//       }
//     )
//     {
//       id
//       nome
//       rotulo
//   }
//     }
