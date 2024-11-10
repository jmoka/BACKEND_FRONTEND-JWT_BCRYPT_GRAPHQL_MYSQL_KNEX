// Importa o ApolloServer e gql do pacote 'apollo-server'
// ApolloServer é usado para criar o servidor GraphQL
const { ApolloServer, gql } = require('apollo-server');

// Importa a função 'importSchema' do pacote 'graphql-import' para importar esquemas GraphQL de arquivos separados
const { importSchema } = require('graphql-import');

// Importa os resolvers que contêm a lógica para resolver as operações GraphQL
const resolvers = require('./resolvers');

// Importa uma função que cria o banco de dados, possivelmente inicializando a base de dados
const CriarBaseDados = require("./data/criarDB");

// Importa o contexto que será usado no Apollo Server, como informações de autenticação ou outros dados compartilhados
const context = require("./data/context");

// Caminho do arquivo que contém o esquema GraphQL
const schemaPath = './schema/index.graphql';

// Cria uma nova instância do ApolloServer com a configuração necessária
const server = new ApolloServer({
    // Define os tipos de dados e operações permitidas no GraphQL, importando o esquema do arquivo especificado
    typeDefs: importSchema(schemaPath),

    // Define os resolvers que irão tratar as operações especificadas no esquema
    resolvers,

    // Configura o contexto para incluir o objeto de requisição, útil para autenticação e outras informações
    context: ({ req }) => ({ req }),
});

// Chama a função para criar o banco de dados
CriarBaseDados();

// Inicia o servidor na porta 4000 e imprime a URL onde ele está sendo executado
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Executando em ${url}`);
});
