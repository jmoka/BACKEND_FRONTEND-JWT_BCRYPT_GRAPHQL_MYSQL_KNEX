const { criarHash } = require('../autenticacao/hash')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Criação da tabela
    await knex.schema.createTable("usuarios", table => {
        table.increments("id").primary()
        table.string("nome", 255).notNullable()
        table.string("email", 255).notNullable().unique()
        table.string("senha", 255).notNullable()
        table.integer("perfil").notNullable()
        table.string("status").notNullable()
        table.timestamp("data_criacao").defaultTo(knex.fn.now())
    })

    // // Gerar o hash da senha do usuário master
    // const admin = await criarHash(process.env.DB_ADMIN);
    // const master = await criarHash(process.env.DB_MASTER) // resolve a promese
    // const dev = await criarHash(process.env.DB_DEV) // resolve a promese

    // // Inserir o usuário master
    // const usuarioInserido = await knex("usuarios").insert([
    //     {
    //         nome: "master",
    //         email: 'master@jotaempresa.com',
    //         senha: master,
    //         perfil: 1,
    //         status: "ATIVO"
    //     },
    //     {
    //         nome: "dev",
    //         email: 'dev@jotaempresas.com',
    //         senha: dev,
    //         perfil: 2,
    //         status: "ATIVO"
    //     },
    //     {
    //         nome: "admin",
    //         email: "admin@jotaempresas.com",
    //         senha: admin,
    //         perfil: 3,
    //         status: "ATIVO"
    //     },
    // ])
    // return usuarioInserido
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("usuarios")
};
