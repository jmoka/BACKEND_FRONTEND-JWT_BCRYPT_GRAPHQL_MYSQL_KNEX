require('dotenv').config(); // Carregar variáveis de ambiente
const knex = require('knex');
const config = require('../knexfile.js');

const env = process.env.NODE_ENV || 'development'; // Pega o ambiente ou usa 'development' como padrão

// Mostrar o nome do banco de dados (opcional)
console.log("BANCO DE DADOS: " + process.env.DB_NAME);

// Verifica se o ambiente é 'development' para mostrar logs adicionais
if (env === 'development') {
    console.log(`Usando o ambiente: ${env}`);
}

let db;

try { 
    db = knex(config[env]);
    console.log(`Conexão com o banco de dados estabelecida no ambiente: ${env}`);
} catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    process.exit(1); // Encerra o processo com erro
}

module.exports = db; // Exporta a conexão para ser usada em outros módulos
