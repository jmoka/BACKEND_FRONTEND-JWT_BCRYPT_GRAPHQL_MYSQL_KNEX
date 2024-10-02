
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    await knex('usuario-perfis').insert([
        // inserindo o perfil o admin na tabela referência
        {
            usuario_id: 2,
            perfil_id: 2
        },
    ])
};
