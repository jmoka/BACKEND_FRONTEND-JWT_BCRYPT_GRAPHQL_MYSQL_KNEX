const { UsuarioEmail } = require("../../../Types/Usuarios/consultar/usuarioEmail");
const Token = require("../../../../autenticacao/token");
const AutenticarHash = require("../../../../autenticacao/hash");
//const dados = require("@data/dados")


async function loginUsuario(dados, req) {
    const errSenhaEmail = new Error("Email ou senha não cadastrado!")
    const erroInativo = new Error("Usuário Inativo")
    const erroUsuario = new Error("Usuário não Definido")

    try {


        const { email, senha } = dados;


        // Buscar o usuário pelo email
        const usuarioEncontrado = await UsuarioEmail(email);


        if (!usuarioEncontrado) throw errSenhaEmail; // Se não encontrar o usuário
        // Verificar se o usuário está ativo
        if (usuarioEncontrado.status !== "ATIVO") throw erroInativo;


        // Autenticar a senha
        const senhaValida = await AutenticarHash.autenticar(senha, usuarioEncontrado.senha);
        if (!senhaValida) throw errSenhaEmail;
        // Gerar o token JWT
        const token = Token.gerarToken(usuarioEncontrado);

        req.headers = {
            authorization: `Bearer ${token}`

        }

        const dadosToken = {
            iat: token.iat,
            exp: token.exp,
            token: token.token
        }

        return { ...usuarioEncontrado, ...dadosToken };

    } catch (e) {
        console.error(e); // Para logar o erro real
        throw erroUsuario
    }
}

module.exports = loginUsuario
