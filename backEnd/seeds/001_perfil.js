/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const perfis = [
    { nome: "admin", rotulo: 'Administrador' },
    { nome: "user", rotulo: 'Usuário' },
  ]

  await knex('perfis').insert(perfis)
};


