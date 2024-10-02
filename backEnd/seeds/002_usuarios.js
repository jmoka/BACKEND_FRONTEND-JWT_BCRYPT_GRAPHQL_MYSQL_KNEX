
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    // criar hash para inserir a senha do perfil master

    await knex('usuarios').insert([
        { nome: "admin", email: "admin@jota.com", senha: process.env.DB_ADMIN, perfil: 2, status: "ATIVO" },
    ]);
};
