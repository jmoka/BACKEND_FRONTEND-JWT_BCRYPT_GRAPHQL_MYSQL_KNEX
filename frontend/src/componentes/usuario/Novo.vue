<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Novo Usuário</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <Erros :erros="erros" />
                    </div>
                    <v-text-field label="Nome" v-model="usuario.nome" />
                    <v-text-field label="E-mail" v-model="usuario.email" />
                    <v-text-field label="Senha" v-model="usuario.senha" type="password" />
                    <v-select label="Perfis" v-model="usuario.perfis" :items="perfis" item-value="id" item-text="rotulo"
                        multiple chips deletable-chips />
                    <v-btn class="ml-0 mt-3" @click="obterPerfis">
                        Obter Perfis
                    </v-btn>
                    <v-btn color="primary" class="ml-0 mt-3" @click="novoUsuario">
                        Novo Usuário
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
                        <v-text-field label="Email" readonly v-model="dados.email" />
                        <v-text-field label="Perfis" readonly :value="perfisRotulos" />
                        <v-text-field label="Data de Criação" readonly v-model="dados.dataCriacao" />
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    components: { Erros },
    data() {
        return {
            usuario: {
                nome: '',
                email: '',
                senha: '',
                perfis: []
            },
            perfis: [],
            dados: null,
            erros: null
        }
    },
    computed: {
        perfisRotulos() {
            return this.dados && this.dados.perfis &&
                this.dados.perfis.map(p => p.rotulo).join(', ');
        },
        perfisSelecionados() {
            if (this.usuario.perfis && this.usuario.perfis.length > 0) {
                return this.usuario.perfis;
            } else {
                return [];
            }
        }
    },
    methods: {
        async novoUsuario() {
            // Resetar erros e dados
            this.erros = null;
            this.dados = null;

            // Validar campos obrigatórios
            if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha || this.usuario.perfis.length === 0) {
                this.erros = ["Todos os campos são obrigatórios."];
                return;
            }

            // Preparar os dados do usuário a partir do formulário
            const userInput = {
                nome: this.usuario.nome,
                email: this.usuario.email,
                senha: this.usuario.senha,
                perfis: this.perfisSelecionados, // Lista de IDs de perfis
                status: "ATIVO" // Supondo que seja uma string
            };

            try {
                const resultado = await this.$api.mutate({
                    mutation: gql`
                        mutation NovoUsuario($user: UserInput!) {
                            novoUsuario(user: $user) {
                                id
                                nome
                                email
                                status
                                perfis {
                                    id
                                    nome
                                    rotulo
                                }
                                dataCriacao
                            }
                        }
                    `,
                    variables: {
                        user: userInput
                    }
                });

                // Armazenar os dados retornados para exibição
                this.dados = resultado.data.novoUsuario;
                console.log("Usuário criado:", this.dados);

                // Limpar o formulário após criação bem-sucedida
                this.usuario = {
                    nome: '',
                    email: '',
                    senha: '',
                    perfis: []
                };
            } catch (error) {
                console.error("Erro ao criar usuário:", error);
                // Extrair e armazenar erros, se disponível
                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                    this.erros = error.graphQLErrors.map(err => err.message);
                } else if (error.networkError) {
                    this.erros = ["Erro de rede. Tente novamente mais tarde."];
                } else {
                    this.erros = ["Ocorreu um erro ao criar o usuário."];
                }
            }
        },

        async obterPerfis() {
            try {
                const resultado = await this.$api.query({
                    query: gql`
                        query {
                            perfis {
                                id
                                rotulo
                            }
                        }
                    `
                });
                this.perfis = resultado.data.perfis;
            } catch (error) {
                console.error("Erro ao obter perfis:", error);
                this.erros = ["Ocorreu um erro ao obter os perfis."];
            }
        }
    },
    created() {
        // Carregar os perfis quando o componente é criado
        this.obterPerfis();
    }
}
</script>

<style scoped>
/* Adicione estilos conforme necessário */
</style>
