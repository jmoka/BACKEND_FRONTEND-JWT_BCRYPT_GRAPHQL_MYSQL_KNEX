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

          <v-select
            label="Usuarios"
            v-model="idInserido"
            :items="user"
            item-value="id"
            :item-text="formatUserText"
            @change="consultar"
          />
            
          <v-btn class="ml-0 mt-3" @click="obterUsuarios">
            Obter Usuários
          </v-btn>

          <v-text-field
            label="ID do Usuário"
            v-model.number="idInserido"
            @click="clearField('nome')"
            readonly
          />
          <v-text-field
            label="Novo Nome"
            v-model="novoNome"
          />
          <v-text-field
            label="Novo Email"
            v-model="novoEmail"
          />
          <v-text-field
            label="Novo Status"
            v-model="novoStatus"
          />
          
          <v-select
            label="Perfis"
            v-model="novoPerfil"
            :items="perfis"
            item-value="id"
            item-text="rotulo"
          />
     
          <v-btn class="ml-0 mt-3" @click="obterPerfis">
            Obter Perfis
          </v-btn>

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
const jwt = require("jsonwebtoken");

export default {
  data() {
    return {
      perfis: [],
      usuario: {
        id: null,
        nome: '',
        email: "",
        status: "",
        perfil: null
      },
      idInserido: null,
      novoNome: "",
      novoEmail: "",
      novoStatus: "",
      novoPerfil: null,

      user: [],
      erros: false,
      msg: '',
    };
  },
  methods: {

    formatUserText(user) {
    return `${user.nome} - id (${user.id})`;
  },

    clearField(campoParaLimpar) {
      if (campoParaLimpar === 'nome') {
        this.usuario.nome = '';
      }
    },

    async alterarNome() {
      console.log("Dados antes da mutação:", {
        id: this.idInserido,
        nome: this.novoNome,
        email: this.novoEmail,
        status: this.novoStatus,
        perfil: this.novoPerfil
      });

      try {
        const resultado = await this.$api.mutate({
          mutation: gql`
            mutation ($id: Int!, $nome: String, $email: String, $status: String, $perfil: Int) {
              alterarUsuario(
                user: {
                  nome: $nome
                  email: $email
                  status: $status
                  perfil: $perfil
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
            id: Number(this.idInserido),
            nome: this.novoNome,
            email: this.novoEmail,
            status: this.novoStatus,
            perfil: Number(this.novoPerfil)
          }
        });

        console.log("Resultado da mutação:", resultado);
        this.msg = "Usuário alterado com sucesso!";
        alert("Usuário alterado com sucesso!");

        this.idInserido = null;
        this.novoNome = "";
        this.novoEmail = "";
        this.novoStatus = "";
        this.novoPerfil = null;
        this.user = [];

        this.erros = false;
      } catch (error) {
        this.erros = true;
        this.msg = 'Erro ao alterar nome do usuário: ' + error.message;
        console.error('Erro ao alterar nome do usuário:', error);
      }
    },

    obterUsuarios() {
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
        this.token = localStorage.getItem("token");    

        if (this.token) {
          try {
            this.decode = jwt.decode(this.token);  
            if(this.decode.status !== "ATIVO") throw new Error("Não Ativo");
            if(this.decode.perfil.nome !== "admin" && this.decode.perfil.nome !== "mast") throw new Error("Perfil não Autorizado");

            this.user = resultado.data.usuarios;
            this.erros = null;
          } catch (error) {
            console.error("Erro ao decodificar o token:", error);
          }
        } else {
          alert("Usuário não Logado! , Faça o login e tente novamente");
        }    
      }).catch(e => {
        this.idInserido = null;
        this.novoNome = "";
        this.novoEmail = "";
        this.novoStatus = "";
        this.perfis = [];
        this.user = [];
        alert("Usuário não Logado! , Faça o login e tente novamente => " + e);
      });
    },

    consultar() {
      this.$api.query({
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
          id: Number(this.idInserido)
        }
      })
      .then((resultado) => {
        const usuarioFiltrado = resultado.data.usuarioID;

        if (usuarioFiltrado) {
          this.usuario = {
            id: usuarioFiltrado.id,
            nome: usuarioFiltrado.nome,
            email: usuarioFiltrado.email,
            status: usuarioFiltrado.status,
            perfil: usuarioFiltrado.perfil.id
          };
          this.novoNome = usuarioFiltrado.nome;
          this.novoEmail = usuarioFiltrado.email;
          this.novoStatus = usuarioFiltrado.status;
          this.novoPerfil = usuarioFiltrado.perfil.id;
        }

        console.log("Dados do usuário consultado:", this.usuario);
      })
      .catch((error) => {
        this.erros = true;
        this.msg = error.message;
        console.error('Erro ao consultar usuário:', error);
      });
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
        this.erros = true;
        this.msg = "Perfil não encontrado";
        throw new Error(this.erros);
      }
    }
  }
};
</script>

<style scoped>
/* Estilos adicionais podem ser adicionados aqui */
</style>
