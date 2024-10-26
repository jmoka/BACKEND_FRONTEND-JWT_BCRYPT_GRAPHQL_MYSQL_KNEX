<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-layout column class="ma-3">
          <h1 class="headline">Filtrar e Alterar Usuário</h1>
          <v-divider class="mb-3" />
          <div v-if="erros">
            <v-alert :value="true" type="error">
              {{ msg }}
            </v-alert>
          </div>

          <v-text-field
            label="ID"
            v-model.number="usuario.id"
            @click="clearField('email')"
          />
          <v-text-field
            label="E-mail"
            v-model="usuario.email"
            @click="clearField('id')"
          />
          <v-btn color="primary" class="ml-0 mt-3" @click="consultar">
            Consultar
          </v-btn>

          <h1 class="mt-4 headline">Alterar Usuário</h1>
          <v-divider class="mb-3" />
          <v-text-field label="Nome" v-model="usuario.nome" />
          <v-text-field label="Email" v-model="usuario.email" />
          <v-text-field label="Status" v-model="usuario.status" />
          <v-select
            label="Perfis"
            v-model="usuario.perfil"
            :items="perfis"
            item-value="id"
            item-text="rotulo"
          />
          <v-btn class="ml-0 mt-3" @click="obterPerfis">
            Obter Perfis
          </v-btn>
          <v-btn color="primary" class="ml-0 mt-3" @click="alterarUsuario">
            Alterar Usuário
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
            <v-text-field label="Status" readonly v-model="dados.status" />
          </template>
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
        id: "",
        email: '',
        nome: '',
        status: '',
        perfil: '',
      },
      perfis: [],
      dados: null,
      erros: false,
      msg: '',
    };
  },
  methods: {
    clearField(campoParaLimpar) {
      if (campoParaLimpar === 'email') {
        this.usuario.id = null;
      } else if (campoParaLimpar === 'id') {
        this.usuario.email = null;
      }
    },

    validarCamposObrigatorios() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.erros = true;
        this.msg = 'Usuário não logado! Faça o login e tente novamente.';
        return false;
      }
      return true;
    },

    async consultar() {
      if (!this.validarCamposObrigatorios()) {
        return;
      }

      if (!this.usuario.id && !this.usuario.email) {
        this.erros = true;
        this.msg = 'Por favor, forneça o ID ou o E-mail do usuário.';
        return;
      }

      try {
        let resultado;
        if (this.usuario.email) {
          resultado = await this.$api.query({
            query: gql`
              query usuarioEmailConsulta($email: String!) {
                usuarioEmailConsulta(email: $email) {
                  id
                  nome
                  email
                  status
                  perfil {
                    id
                    nome
                    rotulo
                  }
                }
              }
            `,
            variables: {
              email: this.usuario.email,
            },
          });
        } else if (this.usuario.id) {
          resultado = await this.$api.query({
            query: gql`
              query usuarioID($id: Int) {
                usuarioID(id: $id) {
                  id
                  nome
                  email
                  status
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
            },
          });
        }

        this.dados = resultado.data.usuarioEmailConsulta || resultado.data.usuarioID;

        if (!this.dados) {
          this.erros = true;
          this.msg = 'Usuário não encontrado.';
        } else {
          this.usuario = { ...this.dados, perfil: this.dados.perfil.id };
        }
      } catch (error) {
        this.erros = true;
        this.msg = error.message;
      }
    },

    async alterarUsuario() {
      console.log("Dados antes da mutação:", {
        id: this.usuario.id,
        nome: this.usuario.nome,
        email: this.usuario.email,
        status: this.usuario.status,
      });

      try {
        const resultado = await this.$api.mutate({
          mutation: gql`
            mutation (
              $id: Int,
              $nome: String,
              $email: String,
              $status: String,
              $perfil: Int
            ) {
              alterarUsuario(
                user: {
                  nome: $nome,
                  email: $email,
                  status: $status,
                }
                filtro: {
                  id: $id
                }
              ) {
                id
                nome
                email
                status
                perfil {
                  id
                  nome
                  rotulo
                }
              }
            }
          `,
          variables: {
            id: this.usuario.id || this.dados.id,
            nome: this.usuario.nome || this.dados.nome, 
            email: this.usuario.email || this.dados.email, 
            status: this.usuario.status || this.dados.status, 
          },
        });

        this.dados = resultado.data.alterarUsuario;
        this.msg = 'Usuário alterado com sucesso.';
        this.erros = false;
      } catch (error) {
        this.erros = true;
        this.msg = 'Erro ao alterar o usuário: ' + error.message;
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
          `,
        });

        this.perfis = resultado.data.perfis;
        if (this.perfis.length > 0) {
          this.usuario.perfil = this.perfis[0].id; // Seleciona o primeiro perfil como padrão
        }
      } catch (error) {
        this.erros = true;
        this.msg = 'Perfis não encontrados';
      }
    },
  },
};
</script>

<style scoped>
/* Estilos adicionais podem ser adicionados aqui */
</style>
