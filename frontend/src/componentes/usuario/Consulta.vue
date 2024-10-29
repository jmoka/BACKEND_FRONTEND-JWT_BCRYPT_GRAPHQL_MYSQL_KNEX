<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-layout column class="ma-3">
          <h1 class="headline">Consultar Usuário</h1>
          <v-divider class="mb-3" />
          <div v-if="erros">
            <v-alert :value="true" type="error">
              {{ msg }}
            </v-alert>
          </div>
          <v-select
            label="Usuários"
            v-model="idInserido"
            :items="user"
            item-value="id"
            item-text="nome"
            @change="consultar"
          />
          <v-btn class="ml-0 mt-3" @click="obterUsuarios">
            Obter Usuários
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
            <v-text-field label="Perfis" readonly :value="perfisRotulos" />
          </template>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';
const jwt = require("jsonwebtoken");

export default {
  data() {
    return {
      usuario: {
        id: null,
        nome: '',
        email: '',
        status: ''
      },
      idInserido: null,
      user: [],
      dados: null,
      erros: false,
      msg: ''
    };
  },
  computed: {
    perfisRotulos() {
      return this.dados && this.dados.perfil
        ? `${this.dados.perfil.nome} (${this.dados.perfil.rotulo})`
        : '';
    }
  },
  methods: {
    consultar() {
      if (this.idInserido) {
        console.log('Consultando usuário com ID:', this.idInserido);
        // Verifica o token antes de fazer a consulta
        if (!this.handleTokenAndData()) return;

        this.$api
          .query({
            query: gql`
              query usuarioID($id: Int!) {
                usuarioID(id: $id) {
                  id
                  nome
                  email
                  perfil {
                    nome
                    rotulo
                  }
                }
              }
            `,
            variables: {
              id: parseInt(this.idInserido)
            }
          })
          .then((resultado) => {
            console.log('Resultado da consulta:', resultado);
            this.dados = resultado.data.usuarioID;
          })
          .catch((e) => {
            this.msg = 'Erro ao consultar usuário: ' + e.message;
            this.erros = true;
            console.log(e);
          });
      } else {
        alert('Por favor, selecione um usuário.');
      }
    },
    handleTokenAndData() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decode = jwt.decode(token);
          console.log('Token decodificado:', decode);

          if (decode.status !== 'ATIVO') throw new Error('Usuário não está ativo');
          if (decode.perfil.nome !== 'admin' && decode.perfil.nome !== 'mast')
            throw new Error('Perfil não autorizado');

          this.erros = false;
          return true; // Autorizado
        } catch (e) {
          this.msg = 'Erro ao decodificar o token: ' + e.message;
          this.erros = true;
          console.log(e);
          return false; // Não autorizado
        }
      } else {
        alert('Usuário não logado! Faça o login e tente novamente.');
        return false;
      }
    },
    obterUsuarios() {
      console.log('Obtendo lista de usuários...');
      if (!this.handleTokenAndData()) return;

      this.$api
        .query({
          query: gql`
            query {
              usuarios {
                id
                nome
                email
                status
                perfil {
                  nome
                  rotulo
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
        })
        .then((resposta) => {
          console.log('Resposta ao obter usuários:', resposta);
          this.user = resposta.data.usuarios;
        })
        .catch((e) => {
          this.msg = 'Erro ao obter usuários: ' + e.message;
          this.erros = true;
          console.log(e);
        });
    }
  }
};
</script>

<style>
/* Adicione seu estilo aqui, se necessário */
</style>
