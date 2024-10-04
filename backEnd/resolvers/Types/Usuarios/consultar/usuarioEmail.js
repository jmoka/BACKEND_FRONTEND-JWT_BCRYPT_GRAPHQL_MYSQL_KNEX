const db = require("@data/db");
const { format } = require("date-fns");

async function UsuarioEmail(email) {

    try {
        const usuarioEmail = await db("usuarios")
            .leftJoin("perfis", "usuarios.perfil", "=", "perfis.id") // Usar leftJoin para incluir usuários sem perfil
            .select(
                "usuarios.id",
                "usuarios.nome",
                "usuarios.email",
                "usuarios.senha",
                "usuarios.status",
                "usuarios.data_criacao",
                "perfis.nome as perfil_nome",
                "perfis.rotulo as perfil_rotulo"
            )
            .where({ "usuarios.email": email })
            .first();

        // Agrupar os resultados para formato esperado pelo GraphQL
        const resultado = {
            id: usuarioEmail.id,
            nome: usuarioEmail.nome,
            email: usuarioEmail.email,
            senha: usuarioEmail.senha,
            status: usuarioEmail.status,
            dataCriacao: format(new Date(usuarioEmail.data_criacao), 'yyyy-MM-dd HH:mm:ss'), // Formatar a data
            perfil: {
                nome: usuarioEmail.perfil_nome,
                rotulo: usuarioEmail.perfil_rotulo
            }
        };
        return resultado;
    } catch (error) {
        console.error(`Usuario com email informado não está cadastrado!!`);
        throw new Error("Usuario com email informado não está cadastrado!!");


    }
}

module.exports = { UsuarioEmail };




// consultar por nome usuario

// query{
//     usuario_Nome(nome:"dddddsddiddddd"){
//       id
//       nome
//       email
//       status
//       perfil {
//         id
//         nome
//         rotulo
//       }
//       dataCriacao
//     }
//   }