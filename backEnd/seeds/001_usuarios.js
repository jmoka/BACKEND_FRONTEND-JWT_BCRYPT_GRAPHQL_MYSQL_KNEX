const { criarHash } = require('../autenticacao/hash')


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    // criar hash para inserir a senha do perfil master

    const admin = await criarHash("Admin@123");
    const master = await criarHash("Master@123") // resolve a promese
    const dev = await criarHash("Dev@123") // resolve a promese

    await knex('usuarios').insert([
        {
            nome: "UserMaster",
            email: 'master@jotaempresa.com',
            senha: master,
            perfil: 1,
            status: "ATIVO"
        },
        {
            nome: "UserDev",
            email: 'dev@jotaempresas.com',
            senha: dev,
            perfil: 2,
            status: "ATIVO"
        },
        {
            nome: "UserAdmin",
            email: "admin@jotaempresas.com",
            senha: admin,
            perfil: 3,
            status: "ATIVO"
        },
    ]);
};
