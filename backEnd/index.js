// const dotenv = require('dotenv');
// dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const { ApolloServer, gql } = require('apollo-server')
const { importSchema } = require('graphql-import')
const resolvers = require('./resolvers')
const CriarBaseDados = require("./data/criarDB")

const context = require("./data/context")

const schemaPath = './schema/index.graphql'

const server = new ApolloServer({
    typeDefs: importSchema(schemaPath),
    resolvers,
    context: ({ req }) => ({ req }),
})

CriarBaseDados();
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Executando em ${url}`)
})

