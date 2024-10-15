const jwt = require("jsonwebtoken");

// É altamente recomendável armazenar o segredo em uma variável de ambiente
const SEGREDO_JWT = process.env.DB_SECRET  // Substitua pelo seu segredo real e mantenha-o seguro


const err = new Error("Token inválido ou expirado")
const Token = {
    // Função para gerar o token JWT
    gerarToken(usuario) {
        const agora = Math.floor(Date.now() / 1000);

        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            status: usuario.status,
            perfil: {
                nome: usuario.perfil.nome,
                rotulo: usuario.perfil.rotulo
            },
            iat: agora,
            exp: agora + (24 * 60 * 60) // Token válido por 24 horas
        };

        // Assinar o token com o segredo do servidor, NÃO com a senha do usuário
        const token = jwt.sign(payload, SEGREDO_JWT);
        

        return {
            ...payload,
            token
        };
    },

    // Função para verificar o token JWT
    verificarToken(token) {
        try {
            const decoded = jwt.verify(token, SEGREDO_JWT);
            return decoded;
        } catch (error) {
            throw err
        }
    }
}

module.exports = Token;
