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
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("usuarios")
};
