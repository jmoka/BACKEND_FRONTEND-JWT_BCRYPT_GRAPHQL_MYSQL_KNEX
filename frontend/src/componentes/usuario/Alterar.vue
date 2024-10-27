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
                <!-- v-select que exibe o 'rotulo' e armazena o 'id' -->
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
        email:"",
        status:""
      },
      idInserido:null,
      novoNome:"",
      novoEmail:"",
      novoStatus:"",
      emailInserido:"",
      user: [],
      usuarioEnconstrado:{
        nome:"nomeEncontrado",
        email:"email encontrado",
        status:"Status Encontrado"
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
    id: this.idInserido,
    nome: this.novoNome,
    email: this.novoEmail,
    status: this.novoStatus
  });

  try {
    const resultado = await this.$api.mutate({
      mutation: gql`
        mutation ($id: Int!, $nome: String, $email: String, $status: String) {
          alterarUsuario(
            user: {
              nome: $nome
              email: $email
              status: $status
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
        status: this.novoStatus
      }
    });

    console.log("Resultado da mutação:", resultado);
    this.msg = "Usuário alterado com sucesso!";
    alert("Usuário alterado com sucesso!")
    this.idInserido=null,
      this.novoNome="",
      this.novoEmail="",
      this.novoStatus="",
      this.emailInserido="",
      this.user= [],

    this.erros = false;
  } catch (error) {
    this.erros = true;
    this.msg = 'Erro ao alterar nome do usuário: ' + error.message;
    console.error('Erro ao alterar nome do usuário:', error);
  }
}
,
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
      }).then(resultado=>{       
        this.user = resultado.data.usuarios     
       
      })

  },

  consultar() {
  console.log(this.idInserido);

  this.$api.query({
    query: gql`
      query usuarioID($id: Int) {
        usuarioID(id: $id) {
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
    variables: {
      id: Number(this.idInserido)
    }
  })
  .then((resultado) => {
    const usuarioFiltrado = resultado.data.usuarioID;

    // Atribui os dados ao objeto usuario e aos campos de novo nome, email e status
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

    console.log("Dados do usuário consultado:", this.usuario);
  })
  .catch((error) => {
    this.erros = true;
    this.msg = error.message;
    console.error('Erro ao consultar usuário:', error);
  });
}


}};
</script>

<style scoped>
/* Estilos adicionais podem ser adicionados aqui */
</style>
