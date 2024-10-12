<template>
    <v-container fluid>
        <v-layout column>
            <v-flex>
                <v-btn color="primary" class="ml-0 mb-4" @click="obterUsuarios">
                    Obter Usuários
                </v-btn>
            </v-flex>
            <v-flex>
                <div v-if="erros" class="mb-4">
                    <Erros :erros="erros" />
                </div>
            </v-flex>
            <v-flex>
                <v-data-table :headers="headers" :items="usuarios" hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome }}</td>
                        <td>{{ props.item.email }}</td>
                        <td>{{ props.item.status }}</td>
                        <td>{{ perfil }}</td>
                    </template>
                </v-data-table>
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
            erros: null,
            perfil: null,
            usuarios: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome' },
                { text: 'E-mail', value: 'email' },
                { text: 'Estatus', value: 'status' },
                { text: 'Perfis', value: 'perfil' },
            ],
        }
    },
    methods: {
        obterUsuarios() {
            console.log("obter user");
            this.$api.query({
                query: gql`
      query {
        usuarios {
          id
          nome
          email
          status
          perfil { nome rotulo }
        }
      }
    `,
            }).then(resultado => {
                //    console.log(resultado.data.usuarios); // Verifique o que está sendo retornado aqui
                this.usuarios = resultado.data.usuarios;
                this.usuarios.forEach(usuario => {
                    this.perfil = usuario.perfil.nome // Acessa o nome do perfil de cada usuário
                });

                this.erros = null;
            }).catch(e => {
                this.usuarios = [];
                this.erros = e.message || "Erro ao obter usuários";
            });
        }
    }
}
</script>

<style></style>
