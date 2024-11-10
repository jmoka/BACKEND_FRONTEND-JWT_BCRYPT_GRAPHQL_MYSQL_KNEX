require('dotenv').config(); // Carregar variáveis de ambiente
const mysql = require("mysql2");

// Função de conexão sem banco de dados especificado
function conexaoSemDB() {
    const dadosConexao = {
        host: 'localhost', // ou 'localhost'
        user: 'root', // seu usuário
        password: '12345678', // sua senha

    };

    const conectar = mysql.createConnection(dadosConexao);

    conectar.connect((err) => {
        if (err) {
            console.error("Erro ao conectar ao MySQL: " + err.message);
            return;
        }
        console.log("Conexão estabelecida com sucesso ao MySQL (sem banco de dados).");
    });

    return conectar;
}

// Função de conexão com o banco de dados
function conexaoComDB() {
    const dadosConexao = {
        host: '127.0.0.1', // ou 'localhost'
        user: 'root', // seu usuário
        password: '12345678', // sua senha
        database: "knexdb",
        port: "3306"
    };

    const conectar = mysql.createConnection(dadosConexao);

    conectar.connect((err) => {
        if (err) {
            console.error("Erro ao conectar ao banco de dados: " + err.message);
            return;
        }
        console.log("Conexão estabelecida com sucesso ao banco de dados.");
    });

    return conectar;
}

async function criarBaseDados() {
    const conectar = conexaoSemDB(); // Conectar sem especificar o banco de dados
    const dbName = "knexdb"; // Nome do banco de dados

    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

    conectar.query(createDatabaseQuery, (err, result) => {
        if (err) {
            console.error("Erro ao criar a base de dados: " + err.message);
        } else {
            console.log(`Base de dados '${dbName}' criada ou já existe.`);
        }
        conectar.end(); // Fechar a conexão após a criação do banco

        // Agora conecte com o banco de dados
        const conectarComDB = conexaoComDB();
        conectarComDB.end(); // Fechar a conexão após usá-la
    });
}

module.exports = criarBaseDados;
