// const dotenv = require('dotenv');
// dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const { ApolloServer, gql } = require('apollo-server')
const { importSchema } = require('graphql-import')
const resolvers = require('./resolvers')
const CriarBaseDados = require("./data/criarDB")
require('module-alias/register')

const schemaPath = './schema/index.graphql'
const server = new ApolloServer({
    typeDefs: importSchema(schemaPath),
    resolvers
})

CriarBaseDados();
server.listen().then(({ url }) => {
    console.log(`Executando em ${url}`)
})

