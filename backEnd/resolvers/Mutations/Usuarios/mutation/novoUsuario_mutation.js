const db = require("@data/db");
const validarEmail = require("@data/validacoes/ValidarUsuarios/validarEmail");
const {Usuario_ID} =  require("../../../Types/Usuarios/consultar/usuarioID");
const {criarHash} = require("../../../../autenticacao/hash")
const perfilDefault = 3;
const statuDefault = 'ATIVO'

module.exports = {
    async novoUsuario(user) {
                       
        try {
            // Verifica se o e-mail já está cadastrado
            const emailExistente = await validarEmail(user.email);
            if (emailExistente) {
              //  console.log("Usuário já cadastrado com esse email");
                throw new Error("Usuário já cadastrado com esse email = " + user.email);
            }
            // criando hash da senha
                    
            const senhaHash = await criarHash(user.senha)   
                       
            // Cria um novo usuário usando os atributos fornecidos em user
            let UsuarioEnviado = {
                nome: user.nome,
                email: user.email,
                senha: senhaHash,
                perfil: user.perfil || 3, // Usa perfilDefault se não for fornecido          
                status: user.status || ATIVO // Usa statuDefault se não for fornecido
            };

            // insere o usuario
            const usuarioInserido = await db('usuarios').insert(UsuarioEnviado)
            // pega o id do usuario cadastrado
            const idUsuario =  await Usuario_ID(...usuarioInserido)
            // cria o obj de casdastro da tabela de relação usuaro perfil      
            let UsuarioPerfil = {
                usuario_id : idUsuario.id,
                perfil_id : user.perfil            }

            // Insere o o perfil associado ao usuario na tabela uaurio-perfis           
            await db("usuario-perfis").insert(UsuarioPerfil)
            
            // retorna uario cadastrado
            console.log(`Usuário com ID: ${idUsuario.id} e Nome: ${user.nome} cadastrado com exito!!`);
            
            return Usuario_ID(usuarioInserido) 
            
            }                    
            
         catch (error) {
            throw new Error(`Erro ao criar usuário: ${ error.message } `);
        }
}}
                 
          
              


// Consulta do Cliente

// mutation{
//     novoUsuario(
//       user: {
//         nome: "d",
//         email: "df@xxx.com",
//         senha: "12fddsds34d56",  
//         perfil: 1,
//         status: ATIVO
//     }
//     ) {
//     id
//       nome
//       email   
//       status
//     	perfil{
//         id
// 				nome
// 				rotulo
//       }
//     dataCriacao
    
     
//       }
//   }