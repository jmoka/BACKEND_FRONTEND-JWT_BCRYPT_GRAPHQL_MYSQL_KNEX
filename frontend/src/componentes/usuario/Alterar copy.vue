<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-layout column class="ma-3">
          <h1 class="headline">Alterar Nome do Usuário</h1>
          <v-divider class="mb-3" />
          
          <div v-if="erros">
            <v-alert :value="true" type="error">
              {{ msg }}
            </v-alert>
          </div>

          <v-text-field
            label="ID do Usuário"
            v-model.number="usuario.id"
            @click="clearField('nome')"
          />
          <v-text-field
            label="Novo Nome"
            v-model="usuario.nome"
          />
          <v-text-field
            label="Novo Email"
            v-model="usuario.email"
          />

          <v-btn color="primary" class="ml-0 mt-3" @click="alterarNome">
            Alterar Nome
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      usuario: {
        id: null,
        nome: '',
        email:""
      },
      erros: false,
      msg: '',
    };
  },
  methods: {
    clearField(campoParaLimpar) {
      if (campoParaLimpar === 'nome') {
        this.usuario.nome = '';
      }
    },

    async alterarNome() {
  console.log("Dados antes da mutação:", {
    id: this.usuario.id,
    nome: this.usuario.nome
  });

  try {
    const resultado = await this.$api.mutate({
      mutation: gql`
        mutation ($id: Int!, $nome: String, $email: String) {
          alterarUsuario(
            user: {
              nome: $nome
              email:$email
            }
            filtro: {
              id: $id
            }
          ) {
            id
            nome
            email
            status
            dataCriacao
            perfil {
              id
              nome
              rotulo
            }
          }
        }
      `,
      variables: {
        id: this.usuario.id,
        nome: this.usuario.nome || "teste",
        email: this.usuario.email || "1@1"
      }
    });

    console.log("Resultado da mutação:", resultado);
  } catch (error) {
    console.error('Erro ao alterar nome do usuário:', error);
  }
}

  },
};
</script>

<style scoped>
/* Estilos adicionais podem ser adicionados aqui */
</style>
