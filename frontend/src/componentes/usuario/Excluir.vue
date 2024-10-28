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
            item-text="nome"
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

          <v-btn color="red" class="ml-0 mt-3" @click="abrirDialog">
            Excluir
          </v-btn>

          <v-dialog v-model="dialogoAberto" max-width="400">
            <v-card>
              <v-card-title class="headline">Confirmar Ação</v-card-title>
              <v-card-text>
                Tem certeza de que deseja EXCLUIR o usuário? Esta ação não pode ser desfeita.
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="confirmarExclusao">
                  Sim, EXCLUIR
                </v-btn>
                <v-btn text @click="cancelar">
                  Não, VOLTAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      dialogoAberto: false,
      usuario: {
        id: null,
        nome: '',
        email: "",
        status: ""
      },
      idInserido: null,
      novoNome: "",
      novoEmail: "",
      novoStatus: "",
      user: [],
      erros: false,
      msg: '',
    };
  },
  methods: {
    abrirDialog() {
      this.dialogoAberto = true;
    },
    confirmarExclusao() {
      this.dialogoAberto = false;
      this.excluirUser();
    },
    cancelar() {
      this.dialogoAberto = false;
    },
    async excluirUser() {
      console.log("Excluindo usuário:", { id: this.idInserido });
      try {
        const resultado = await this.$api.mutate({
          mutation: gql`
            mutation ($id: Int!) {
              excluirUsuario(
                filtro: { id: $id }
              ) {
                id
                nome
                email
                status
              }
            }
          `,
          variables: {
            id: Number(this.idInserido),
          },
        });

        console.log("Resultado da exclusão:", resultado);
        this.msg = "Usuário excluído com sucesso!";
        alert("Usuário excluído com sucesso!");
        
        this.idInserido = null;
        this.novoNome = "";
        this.novoEmail = "";
        this.novoStatus = "";
        this.user = [];
        this.erros = false;
      } catch (error) {
        this.erros = true;
        this.msg = 'Erro ao excluir usuário: ' + error.message;
        console.error('Erro ao excluir usuário:', error);
      }
    },
    async obterUsuarios() {
      try {
        const resultado = await this.$api.query({
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
          fetchPolicy: 'network-only'
        }).then(resposta =>{
          this.handleTokenAndData(resposta.data.resultado);
          this.user = resposta.data.usuarios;

        });
      } catch (error) {
        console.error('Erro ao obter usuários:', error);
      }
    },
    async consultar() {
      console.log("Consultando usuário com ID:", this.idInserido);
      try {
        const resultado = await this.$api.query({
          query: gql`
            query usuarioID($id: Int) {
              usuarioID(id: $id) {
                id
                nome
                email
                status
              }
            }
          `,
          variables: { id: Number(this.idInserido) }
        });
        const usuarioFiltrado = resultado.data.usuarioID;
        if (usuarioFiltrado) {
          this.usuario = {
            id: usuarioFiltrado.id,
            nome: usuarioFiltrado.nome,
            email: usuarioFiltrado.email,
            status: usuarioFiltrado.status
          };
          this.novoNome = usuarioFiltrado.nome;
          this.novoEmail = usuarioFiltrado.email;
          this.novoStatus = usuarioFiltrado.status;
        }
      } catch (error) {
        this.erros = true;
        this.msg = 'Erro ao consultar usuário: ' + error.message;
        console.error('Erro ao consultar usuário:', error);
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
};
</script>
