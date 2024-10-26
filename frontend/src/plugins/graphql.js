// ./src/plugins/graphql.js
import Vue from "vue";
import ApolloClient from 'apollo-client'; // Importação padrão
import { InMemoryCache } from 'apollo-cache-inmemory'; // Importação nomeada
import { createHttpLink } from "apollo-link-http"; // Importação nomeada
import { setContext } from "apollo-link-context"; // Importação nomeada



// Monta a instância do Vue com o ApolloProvider
const httpLink = createHttpLink({
    uri: 'http://localhost:4001', // URL do servidor GraphQL
});

// Apollo Link para adicionar o header de autenticação
const authLink = setContext((_, { headers }) => {
    // Obtenha o token de autenticação do armazenamento local, se existir
    const token = localStorage.getItem('token');
    // Retorne os cabeçalhos ao contexto para que httpLink possa lê-los
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

// Instância do Apollo Client
const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink), // Concatenar authLink e httpLink
    cache: new InMemoryCache(),
});

// Instalação do plugin do Apollo Client no Vue
Vue.prototype.$api = apolloClient;

// Exporta a instância do Apollo Client
export default apolloClient;
