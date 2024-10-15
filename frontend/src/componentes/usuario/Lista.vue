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
            <td>{{ props.item.perfil.nome }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Erros from '../comum/Erros'
import gql from 'graphql-tag'
const jwt = require("jsonwebtoken");

export default {
  components: { Erros },
  data() {
    return {
      token: null,
      decode: null,
      erros: null,
      usuarios: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'E-mail', value: 'email' },
        { text: 'Estatus', value: 'status' },
        { text: 'Perfis', value: 'perfil.nome' },
      ],
    };
  },
  methods: {
    obterUsuarios() {
      console.log("Obter usuários");

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
      })
      .then(resultado => {
        // Obter token do localStorage e decodificar
        this.token = localStorage.getItem("token");
        if (this.token) {
          try {
            this.decode = jwt.decode(this.token);  // Decodifica sem verificar
            console.log("Token Decodificado:", this.decode);
            if(this.decode.status !== "ATIVO")throw new Error("Não Ativo");
            if(this.decode.perfil.nome !== "admin" && this.decode.perfil.nome !== "mast" )throw new Error("Perfil não Autorizado");
                     
            this.usuarios = resultado.data.usuarios;
            this.erros = null;
            
          } catch (error) {
            console.error("Erro ao decodificar o token:", error);
          }
        } else {
          alert("Usuário não Logado! , Faça o login e tente novamente")
        }

      
      })
      .catch(e => {
        this.usuarios = [];
        this.erros = e.message || "Erro ao obter usuários";
      });
    }
  }
}
</script>

<style></style>
