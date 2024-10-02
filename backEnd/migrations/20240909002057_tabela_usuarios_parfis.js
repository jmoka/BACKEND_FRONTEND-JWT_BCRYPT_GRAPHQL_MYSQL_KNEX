/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex, Promise) {

    return knex.schema
        .createTable("usuario-perfis", table => {
            table.integer("usuario_id").unsigned()
            table.integer("perfil_id").unsigned()
            table.foreign("usuario_id").references("usuarios.id")
            table.foreign("perfil_id").references("perfis.id")
        }).then(function () {
            const relacaoMaster = knex("usuario-perfis").insert(
                {
                    usuario_id: 1,
                    perfil_id: 1
                }
            )
            return relacaoMaster;
        })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("usuario-perfis")
};
