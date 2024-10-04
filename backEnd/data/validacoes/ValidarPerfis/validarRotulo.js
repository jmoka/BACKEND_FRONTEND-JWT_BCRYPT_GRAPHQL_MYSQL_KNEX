const db = require('@data/db');
async function validarRotuloPerfil(rotulo) {
    try {
        const perfil = await db("perfis").where({ rotulo: rotulo })
        if (perfil.length > 0) {
            return perfil
        } else {
            return false
        }
    } catch (error) {
        throw new Error("Algo deu errado, verifique sua conexão com o banco de dados");
    }
}
module.exports = validarRotuloPerfil;
