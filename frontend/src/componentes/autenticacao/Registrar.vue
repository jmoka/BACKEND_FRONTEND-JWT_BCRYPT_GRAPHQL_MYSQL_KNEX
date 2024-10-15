<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Registrar</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <Erros :erros="erros" />
                    </div>
                    <v-text-field label="Nome" v-model="usuario.nome" />
                    <v-text-field label="E-mail" v-model="usuario.email" />
                    <v-text-field label="Senha" v-model="usuario.senha" type="password" />
                    <v-btn color="primary" class="ml-0 mt-3" @click="registrar">
                        Registrar
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Resultado</h1>
                    <v-divider />
                    <template v-if="dados">
                        <v-text-field label="ID" readonly v-model="dados.id" />
                        <v-text-field label="Nome" readonly v-model="dados.nome" />
                        <v-text-field label="E-mail" readonly v-model="dados.email" />
                        <v-text-field label="Perfis" readonly
                            :value="dados.perfil ? dados.perfil.nome : 'Nenhum perfil'" />
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Erros from '../comum/Erros';
import gql from 'graphql-tag';

export default {
    components: { Erros },
    data() {
        return {
            usuario: {
                nome: '',
                email: '',
                senha: ''
            },
            dados: null,
            erros: null
        };
    },
    methods: {
        registrar() {
            console.log("registrar");
            
            this.$api
                .mutate({
                    mutation: gql`
                        mutation novoUsuario($nome: String!, $email: String!, $senha: String!) {
                            novoUsuario(user: { nome: $nome, email: $email, senha: $senha }) {
                                id
                                nome
                                email
                                status 
                                perfil { 
                                    nome 
                                }            
                            }
                        }
                    `,
                    variables: {
                        nome: this.usuario.nome,
                        email: this.usuario.email,
                        senha: this.usuario.senha,
                    }
                })
                .then(resultado => {
                    console.log('Resultado da mutação:', resultado); // Log do resultado
                    this.dados = resultado.data.novoUsuario; // Captura os dados retornados
                    this.usuario = { nome: '', email: '', senha: '' }; // Limpa os campos após o sucesso
                    this.erros = null; // Limpa os erros
                })
                .catch(e => {
                    console.error('Erro ao registrar usuário:', e); // Log do erro
                    this.erros = e.graphQLErrors
                        ? e.graphQLErrors.map(err => ({ message: err.message }))
                        : [{ message: e.message }];
                });
        }
    }
};
</script>
