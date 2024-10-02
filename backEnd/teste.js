
const db = require("./data/db"); // Certifique-se de que este caminho esteja correto
const { Autenticar } = require("./autenticacao/hash")

async function name() {
    const user = await db("usuarios").where({ nome: "dev4" }).first()

    const senha = "dev4@123"
    const hash = user.senha


    Autenticar(senha, hash)




}


name()

