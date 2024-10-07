const db = require("@data/db");
const validarEmail = require("@data/validacoes/ValidarUsuarios/validarEmail");
const validarIdUsuarios = require("@data/validacoes/ValidarUsuarios/validarID");
const validarNomeUsuarios = require("@data/validacoes/ValidarUsuarios/validarNome");

module.exports = {
    async excluirUsuario(filtro) {
        const { id, nome, email } = filtro; 

        let usuarioEncontrado;

        // Validar e buscar o usuário
        if (id) {
            await validarIdUsuarios(id);
            usuarioEncontrado = await db("usuarios").where({ id }).first();
            if (!usuarioEncontrado) {
                throw new Error(`Usuario com Id ${id} não encontrado!!`);
            }     
                           
           await db("usuario-perfis").where({ usuario_id: id }).del()

        } else if (nome) {
            await validarNomeUsuarios(nome);
            usuarioEncontrado = await db("usuarios").where({ nome }).first();
            if (!usuarioEncontrado) {
                throw new Error(`Usuario com Nome ${nome} não encontrado!!`);
            }
           await db("usuario-perfis").where({ usuario_id: usuarioEncontrado.id }).del()
        
        } else if (email) {
            await validarEmail(email);
            usuarioEncontrado = await db("usuarios").where({ email }).first();
            if (!usuarioEncontrado) {
                throw new Error(`Usuario com Email ${Email} não encontrado!!`);
            }
           await db("usuario-perfis").where({ usuario_id: usuarioEncontrado.id }).del()
        }
     
 
        const perfil = await db("perfis").where({ id: usuarioEncontrado.perfil }).first()
        const retorno = {
            id: usuarioEncontrado.id,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email,
            status: usuarioEncontrado.status,
            dataCriacao: usuarioEncontrado.data_criacao,
            perfil: {
                id: perfil.id,
                nome: perfil.nome,
                rotulo: perfil.rotulo
            }
        }
        console.log(`Usuário com ID: ${retorno.id} e Nome: ${retorno.nome} Deletado com sucesso!! `);
        return retorno;
    },

};

// Excluir Usuarios



// mutation{
//     excluirUsuario(
//     filtro:{
//        id:318
//        nome:""
//        email:""
//     }  
//     ){
//       nome
//         id
//       email
//       status
//       dataCriacao
//     perfil{
//       nome
//       rotulo
//     }
    
      
//     }
      
//     }


