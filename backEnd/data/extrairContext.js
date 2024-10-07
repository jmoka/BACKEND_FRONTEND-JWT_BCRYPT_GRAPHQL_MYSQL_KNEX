const jwt = require('jsonwebtoken');

function extrairTokenContext(ctx) {
    console.log("Iniciando extrairTokenContext");
    if (!ctx || !ctx.req || !ctx.req.headers) {
        console.log("Contexto ou requisição não encontrados");
        throw new Error("Requisição inválida ou contexto não disponível");
    }
    const authHeader = ctx.req.headers.authorization;
    if (!authHeader) {
        console.log("Cabeçalho de autorização não encontrado");
        throw new Error("Token não encontrado");
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        throw new Error("Token não encontrado após 'Bearer'");
    }
    return token;
}

function extrairDecoded(token) {
    const SEGREDO_JWT = process.env.DB_SECRET;
    if (!SEGREDO_JWT) {
        console.log("Segredo JWT não definido");
        throw new Error("Configuração inválida do servidor");
    }
    try {
        const decoded = jwt.verify(token, SEGREDO_JWT);
        return decoded;
    } catch (err) {
        console.log("Erro ao decodificar o token:", err.message);
        throw new Error("Token inválido");
    }
}

function extrairObjDecoder(ctx) {
    const token = extrairTokenContext(ctx);
    const decodedExtraido = extrairDecoded(token);
    return decodedExtraido;
}
module.exports = {
    extrairTokenContext,
    extrairDecoded,
    extrairObjDecoder
};
