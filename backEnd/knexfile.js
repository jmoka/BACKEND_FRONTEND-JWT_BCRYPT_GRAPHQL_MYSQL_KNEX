require('dotenv').config(); // Carregar variáveis de ambiente

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1', // ou 'localhost'
        user: 'root', // seu usuário
        password: '123', // sua senha
        database: "knexdb",
        port:  "3306"
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1', // ou 'localhost'
        user: 'root', // seu usuário
        password: '123', // sua senha
        database: "knexdb",
        port:  "3306",
      ssl: { rejectUnauthorized: false }
    }
  }
};
