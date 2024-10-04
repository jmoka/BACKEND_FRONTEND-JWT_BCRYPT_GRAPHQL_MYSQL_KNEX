const db = require('@data/db');

async function validarEmail(email) {
    try {

        const usuarios = await db("usuarios");

        const EmailEncontrado = usuarios.filter(u => u.email === email).length > 0;

        return EmailEncontrado

    } catch (error) {
        throw new Error("Algo deu errado, verifique sua conexão com o banco de dados");
    }
}

module.exports = validarEmail;
