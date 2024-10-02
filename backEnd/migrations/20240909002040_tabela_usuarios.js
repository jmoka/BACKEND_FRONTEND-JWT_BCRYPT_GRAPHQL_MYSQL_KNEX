const { Criarhash } = require('../autenticacao/hash')

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

    // Gerar o hash da senha do usuário master
    const hashedPassword = await Criarhash(process.env.DB_MASTER) // resolve a promese

    // Inserir o usuário master
    await knex("usuarios").insert([
        {
            nome: "master",
            email: 'master@master.com',
            senha: hashedPassword, // Usando o hash gerado
            perfil: 1,
            status: "ATIVO"
        }
    ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("usuarios")
};
