const { UsuarioEmail } = require("./usuarioEmail");
const Token = require("../../../../autenticacao/token");
const AutenticarHash = require("../../../../autenticacao/hash");

async function UsuarioLogado(dados = {}) {
    try {
        const { email, senha } = dados;
        //  console.log(`Tentando autenticar usuário com email: ${email}`);

        // Buscar o usuário pelo email
        const usuarioEncontrado = await UsuarioEmail(email);
        //  console.log(`Status do usuário: ${usuarioEncontrado.status}`);

        // Verificar se o usuário está ativo
        if (usuarioEncontrado.status !== "ATIVO") {
            throw new Error("Usuário inativo.");
        }

        // Autenticar a senha
        const senhaValida = await AutenticarHash.autenticar(senha, usuarioEncontrado.senha);
        if (!senhaValida) {
            throw new Error("Senha incorreta.");
        }
        // Gerar o token JWT
        const tokenGerado = Token.gerarToken(usuarioEncontrado);
        console.log("Usuário autenticado com sucesso");
        return tokenGerado;
    } catch (error) {
        // console.error('Erro ao logar usuário:', error);
        throw new Error(error.message || "Erro ao logar usuário.");
    }
}

module.exports = UsuarioLogado;