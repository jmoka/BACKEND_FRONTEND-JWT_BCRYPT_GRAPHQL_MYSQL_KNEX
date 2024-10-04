const db = require("@data/db");
const { format } = require("date-fns");

async function UsuarioNome(nome) {

    try {
        const usuarioNome = await db("usuarios")
            .leftJoin("perfis", "usuarios.perfil", "=", "perfis.id") // Usar leftJoin para incluir usuários sem perfil
            .select(
                "usuarios.id",
                "usuarios.nome",
                "usuarios.email",
                "usuarios.status",
                "usuarios.data_criacao",
                "perfis.nome as perfil_nome", // Nome do perfil
                "perfis.rotulo as perfil_rotulo" // Rótulo do perfil
            )
            .where({ "usuarios.nome": nome }) // Use "usuarios.id" para evitar conflito de escopo
            .first();

        if (!usuarioNome) {
            throw new Error("Não foi possível retornar nenhum usuário com esse Nome == " + nome);
        }

        // Agrupar os resultados para formato esperado pelo GraphQL
        const resultado = {
            id: usuarioNome.id,
            nome: usuarioNome.nome,
            email: usuarioNome.email,
            status: usuarioNome.status,
            dataCriacao: format(new Date(usuarioNome.data_criacao), 'yyyy-MM-dd HH:mm:ss'), // Formatar a data
            perfil: {
                nome: usuarioNome.perfil_nome || "Perfil não definido",
                rotulo: usuarioNome.perfil_rotulo || "Rótulo não definido"
            }
        };

        return resultado;
    } catch (error) {
        throw new Error("Não foi possível retornar o usuário com esse Nome." + nome); // Mensagem sem "cathe"
    }
}

module.exports = UsuarioNome;




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