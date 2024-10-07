const { UsuarioEmail } = require("../../../Types/Usuarios/consultar/usuarioEmail");
const Token = require("../../../../autenticacao/token");
const AutenticarHash = require("../../../../autenticacao/hash");
//const dados = require("@data/dados")


async function loginUsuario(dados) {
    const errSenhaEmail = new Error("Email ou senha não cadastrado!")
    const erroInativo = new Error("Usuário Inativo")
    const erroUsuario = new Error("Usuário não Definido")

    try {
        const { email, senha } = dados;
        // Buscar o usuário pelo email
        const usuarioEncontrado = await UsuarioEmail(email);
        // Verificar se o usuário está ativo
        if (usuarioEncontrado.status !== "ATIVO") throw erroInativo;
        // Autenticar a senha
        const senhaValida = await AutenticarHash.autenticar(senha, usuarioEncontrado.senha);
        if (!senhaValida) throw errSenhaEmail;
        // Gerar o token JWT
        const tokenGerado = Token.gerarToken(usuarioEncontrado);

        return tokenGerado;

    } catch (e) {
        vencimento
        throw erroUsuario
    }
}

module.exports = loginUsuario
