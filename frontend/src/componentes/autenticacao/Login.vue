<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Login</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <Erros :erros="erros" />
                    </div>
                    <v-text-field label="E-mail" v-model="usuario.email" />
                    <v-text-field label="Senha" v-model="usuario.senha" type="password" />
                    <v-btn color="primary" class="ml-0 mt-3" @click="login">
                        Logar
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
                        <v-text-field label="Token" readonly v-model="dados.token" />
                        <v-text-field label="Perfis" readonly v-model="perfis" />
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    components: { Erros },
    data() {
        return {
            usuario: {},
            dados: null,
            erros: null
        }
    },
    computed: {
        // Computed property to format the profiles into a string
        perfis() {
            return this.dados && this.dados.perfis
                ? this.dados.perfis.map(p => p.nome).join(', ')
                : 'Nenhum perfil disponível';
        }
    },
    methods: {
        ...mapActions(['setUsuario']),
        login() {
            this.$api
                .mutate({
                    mutation: gql`
                    mutation loginUsuario($email: String!, $senha:String!) {
                        loginUsuario(dados: {
                            email: $email,
                            senha: $senha
                        }) {
                            id
                            nome
                            email
                            token
                            perfil {
                                nome
                            }
                        }
                    }`,
                    variables: {
                        email: this.usuario.email,
                        senha: this.usuario.senha,
                    }
                })
                .then(resultado => {
                    this.dados = resultado.data.loginUsuario; // Captura os dados retornados, incluindo perfis
                    this.usuario = {}; // Limpa os campos de login
                    this.erros = null; // Limpa os erros
                    this.setUsuario(this.dados); // Armazena os dados do usuário no Vuex
                })
                .catch(e => {
                    console.error('Erro ao Logar o usuário:', e); // Log do erro
                    this.erros = e.graphQLErrors
                        ? e.graphQLErrors.map(err => ({ message: err.message }))
                        : [{ message: e.message }];
                });
        }
    }
}
</script>

<style></style>
