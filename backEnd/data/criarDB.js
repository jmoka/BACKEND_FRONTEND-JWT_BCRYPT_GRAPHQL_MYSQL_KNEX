const mysql = require("mysql2"); // Use mysql2
const Dados = require("../knexfile")

function conexao() {
    const dadosConexao = {
        host: Dados.production.connection.host,
        user: Dados.production.connection.user,
        password: Dados.production.connection.password
        // Não coloque a base de dados aqui, pois vamos criá-la
    };

    const conectar = mysql.createConnection(dadosConexao);

    // Tentar conectar ao banco de dados
    conectar.connect((err) => {
        if (err) {
            console.error("Erro ao conectar ao Banco: " + err.message);
            return;
        }
        // console.log("Conexão estabelecida com sucesso ao banco de dados.");
    });

    return conectar;
}

async function criarBaseDados() {
    const conectar = conexao();
    const dbName = process.env.DB_NAME;

    // Criar a base de dados se não existir
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

    conectar.query(createDatabaseQuery, (err, result) => {
        if (err) {
            console.error("Erro ao criar a base de dados: " + err.message);
        } else {
            // console.log(`Base de dados '${dbName}' criada ou já existe.`);
        }

        // Fechar a conexão após a operação
        conectar.end();
    });
}



module.exports = criarBaseDados; // Se necessário para uso posterior
