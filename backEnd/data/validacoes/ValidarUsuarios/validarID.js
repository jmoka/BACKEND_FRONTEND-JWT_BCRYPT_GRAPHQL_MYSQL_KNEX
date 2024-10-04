const db = require('@data/db');
async function validarIdUsuarios(id) {
    try {
        const usuario = await db("usuarios").where({ id: id })
        if (usuario.length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        throw new Error("Usuário não Encontrado");
    }
}
module.exports = validarIdUsuarios;
