const { UsuarioEmail } = require("../../../Types/Usuarios/consultar/usuarioEmail");
const Token = require("../../../../autenticacao/token");
const AutenticarHash = require("../../../../autenticacao/hash");
const dados = require("@data/dados")
async function loginUsuario(dados) {
    try {
        const { email, senha } = dados;

        // Buscar o usuário pelo email
        const usuarioEncontrado = await UsuarioEmail(email);

        // Verificar se o usuário está ativo
        if (usuarioEncontrado.status !== "ATIVO") {
            throw new Error("Usuário inativo.");
        }
        // Autenticar a senha
        const senhaValida = await AutenticarHash.autenticar(senha, usuarioEncontrado.senha);
        if (!senhaValida) {
            console.error(`Usuario com senha informado não está cadastrado!!`);
            throw new Error("Senha incorreta.");
        }
        // Gerar o token JWT
        const tokenGerado = Token.gerarToken(usuarioEncontrado);
        console.log("Usuário autenticado com sucesso");
        return tokenGerado;
    } catch (error) {
        throw new Error(error.message || "Erro ao logar usuário.");
    }
}

async function Dados() {
    return dados
}

module.exports = loginUsuario, Dados;
