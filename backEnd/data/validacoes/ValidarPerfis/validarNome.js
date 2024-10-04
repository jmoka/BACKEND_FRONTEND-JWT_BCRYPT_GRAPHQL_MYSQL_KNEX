const db = require('@data/db');
async function validarNomePerfil(nome) {
    try {
        const perfil = await db("perfis").where({ nome: nome })
        if (usuario.length > 0) {
            return perfil
        } else {
            return false
        }
    } catch (error) {
        throw new Error("Informe um valor válido");
    }
}
module.exports = validarNomePerfil;
