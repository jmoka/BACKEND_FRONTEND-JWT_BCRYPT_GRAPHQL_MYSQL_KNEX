const db = require('@data/db');
async function validarIdPerfil(id) {
    try {
        const perfil = await db("perfis").where({ id: id })
        if (perfil.length > 0) {
            return perfil
        } else {
            return false
        }
    } catch (error) {
        throw new Error("Usuário não Encontrado");
    }
}
module.exports = validarIdPerfil;
