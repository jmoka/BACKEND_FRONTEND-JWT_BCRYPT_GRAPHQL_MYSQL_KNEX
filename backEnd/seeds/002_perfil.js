/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('perfis').del();  // Limpa a tabela antes de inserir

  const perfis = [
    { nome: "mast", rotulo: "Master" },
    { nome: "dev", rotulo: "Developer" },
    { nome: "admin", rotulo: 'Administrador' },
    { nome: "user", rotulo: 'Usuário' },
  ]

  await knex('perfis').insert(perfis)
};


