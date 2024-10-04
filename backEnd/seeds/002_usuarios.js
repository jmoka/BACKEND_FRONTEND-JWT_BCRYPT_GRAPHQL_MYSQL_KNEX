const { criarHash } = require('../autenticacao/hash')


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    // criar hash para inserir a senha do perfil master

    const hash = await criarHash(process.env.DB_ADMIN);

    await knex('usuarios').insert([
        { nome: "admin", email: "admin@jota.com", senha: hash, perfil: 2, status: "ATIVO" },
    ]);
};
