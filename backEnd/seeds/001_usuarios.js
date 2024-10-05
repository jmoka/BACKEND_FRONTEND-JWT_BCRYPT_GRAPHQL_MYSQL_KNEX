const { criarHash } = require('../autenticacao/hash')


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    // criar hash para inserir a senha do perfil master

    const admin = await criarHash(process.env.DB_ADMIN);
    const master = await criarHash(process.env.DB_MASTER) // resolve a promese
    const dev = await criarHash(process.env.DB_DEV) // resolve a promese

    await knex('usuarios').insert([
        {
            nome: "master",
            email: 'master@jotaempresa.com',
            senha: master,
            perfil: 1,
            status: "ATIVO"
        },
        {
            nome: "dev",
            email: 'dev@jotaempresas.com',
            senha: dev,
            perfil: 2,
            status: "ATIVO"
        },
        {
            nome: "admin",
            email: "admin@jotaempresas.com",
            senha: admin,
            perfil: 3,
            status: "ATIVO"
        },
    ]);
};
