const { extrairDecoded } = require("./extrairContext")
module.exports = async ({ req }) => {

    // simulando usuario logado
    //  await require('./simularUsuarioLogado')(req)

    // setando o authorization
    const auth = req.headers.authorization


    // setando o token
    // testando a authorization 

    // parametros
    let usuario = null;
    let perfilSetado = false;

    const token = auth && auth.substring(7)

    // 1 - verificar se o token está valido

    if (token) {
        try {
            const conteudoToken = extrairDecoded(token)
            let agora = new Date().getTime()
            let validadeToken = conteudoToken.exp * 1000
            // verificandoa validade do token
            if (validadeToken > agora) {
                usuario = conteudoToken
            }


        } catch (error) {
            // sem retorno 
            // porém se caiu akim é invalido 
            // sem retorno para continuar a aplicação
            console.error("Erro ao extrair token:", error.message);
        }
    }

    // if (usuario && usuario.perfil.nome === "mast" || usuario.perfil.nome === "dev" || usuario.perfil.nome === "admin") {
    //     perfilSetado = usuario.perfil.nome
    // }
    // const err = new Error("Acesso Negado")


    return {
        usuario,
        perfilSetado,
        // validarUsuario() {
        //     if (!usuario) throw err
        // },
        // validarPerfil() {
        //     if (!perfilSetado) throw err

        // }

    }
}
