<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-layout column class="ma-3">
          <h1 class="headline">Consultar Usuário</h1>
          <v-divider class="mb-3" />
          <div v-if="erros">
            <Erros :erros="erros" />
          </div>
          <v-text-field label="ID" v-model.number="usuario.id" />
          <v-text-field label="E-mail" v-model="usuario.email" />
          <v-btn color="primary" class="ml-0 mt-3" @click="consultar">
            Consultar
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
import Erros from '../comum/Erros'
import gql from 'graphql-tag'
const jwt = require("jsonwebtoken");

export default {
  components: { Erros },
  data() {
    return {
      usuario: {
        id: "",
        email: ""
      },
      dados: null,
      erros: null
    }
  },
  computed: {
    perfisRotulos() {
      return this.dados && this.dados.perfil
        ? `${this.dados.perfil.nome} (${this.dados.perfil.rotulo})`
        : ''
    }
  },
  methods: {
    consultar() {
      // Checar se o ID ou o email foram fornecidos
      if (this.usuario.email) {
        // Consulta por email
        this.$api.query({
          query: gql`
            query usuarioEmailConsulta($email: String) {
          usuarioEmailConsulta(email: $email) {
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
            email: this.usuario.email
          }
        })
        .then((resultado) => {
          this.handleTokenAndData(resultado.data.usuarioEmailConsulta);
        })
        .catch((error) => {
          this.erros = error.message;
        });
      } else if (this.usuario.id) {
        // Consulta por ID
        this.$api.query({
          query: gql`
            query usuarioID($id: Int) {
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
            id: this.usuario.id
          }
        })
        .then((resultado) => {
          this.handleTokenAndData(resultado.data.usuarioID);
        })
        .catch((error) => {
          this.erros = error.message;
        });
      } else {
        alert("Por favor, forneça o ID ou o E-mail do usuário.");
      }
    },
    handleTokenAndData(dadosUsuario) {
      this.token = localStorage.getItem("token");
      if (this.token) {
        try {
          this.decode = jwt.decode(this.token);  // Decodifica sem verificar
          console.log("Token Decodificado:", this.decode);
          
          if (this.decode.status !== "ATIVO") throw new Error("Não Ativo");
          if (this.decode.perfil.nome !== "admin" && this.decode.perfil.nome !== "mast") throw new Error("Perfil não Autorizado");
          
          // Popula os dados com o retorno correto
          this.dados = dadosUsuario;
          this.erros = null;
          
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
        }
      } else {
        alert("Usuário não Logado! Faça o login e tente novamente");
      }
    }
  }
}
</script>

<style>
/* Adicione seu estilo aqui, se necessário */
</style>
