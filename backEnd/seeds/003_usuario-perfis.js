
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    await knex('usuarioperfis').insert([
        // inserindo o perfil o admin na tabela referência
        {
            usuario_id: 1,
            perfil_id: 1
        },
        {
            usuario_id: 2,
            perfil_id: 2
        },
        {
            usuario_id: 3,
            perfil_id: 3
        },
    ])
};
