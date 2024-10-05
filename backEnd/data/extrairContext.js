const jwt = require('jsonwebtoken');
module.exports = {
    extrairTokenContext(ctx) {
        if (!ctx || !ctx.req || !ctx.req.headers) {
            console.log("Contexto ou requisição não encontrados");
            throw new Error("Requisição inválida ou contexto não disponível");
        }
        // Logar todos os headers para verificar o que está sendo enviado
        //console.log("Headers:", ctx.req.headers);
        // Tentar extrair o cabeçalho de autorização
        const authHeader = ctx.req.headers.authorization;
        if (!authHeader) {
            console.log("Cabeçalho de autorização não encontrado");
            throw new Error("Token não encontrado");
        }
        // Logar o cabeçalho de autorização
        //  console.log("Authorization Header:", authHeader);
        // Extrair o token após o prefixo 'Bearer'
        // const token1 = authHeader.split(' ')[1];
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            throw new Error("Token não encontrado após 'Bearer'");
        }
        // Logar o token extraído
        //  console.log("Token2 extraído: ", token);
        return token
    },
    extrairDecoded(token) {
        // console.log(token);
        const SEGREDO_JWT = process.env.DB_SECRET
        try {
            decoded = jwt.verify(token, SEGREDO_JWT);   // Pode ser jwt.verify se quiser verificar a assinatura
        } catch (err) {
            console.log("Erro ao decodificar o token:", err.message);
            throw new Error("Token inválido");
        }
        // Logar o token decodificado
        // console.log("Token decodificado: ", decoded);
        return decoded;
    }
}
