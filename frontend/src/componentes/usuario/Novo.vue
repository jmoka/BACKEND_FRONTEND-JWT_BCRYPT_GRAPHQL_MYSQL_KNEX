<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Novo Usuário</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <v-alert :value="true" type="error">
                            {{ msg }}
                        </v-alert>
                    </div>
                    <v-text-field label="*Nome" v-model="usuario.nome" />
                    <v-text-field label="*E-mail" v-model="usuario.email" />
                    <v-text-field label="*Senha" v-model="usuario.senha" type="password" />
                    
                    <!-- v-select que exibe o 'rotulo' e armazena o 'id' -->
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
                        <v-text-field label="*ID" readonly v-model="dados.id" />
                        <v-text-field label="*Nome" readonly v-model="dados.nome" />
                        <v-text-field label="*Email" readonly v-model="dados.email" />
                        <v-text-field label="Status" readonly v-model="dados.status" />
                        <v-text-field label="Perfis" readonly v-model="dados.perfil.rotulo" />
                        <v-text-field label="Data de Criação" readonly v-model="dados.dataCriacao" />
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import gql from 'graphql-tag'
const jwt = require("jsonwebtoken");

export default {
       data() {
        return {
            usuario: {
                nome: '',
                email: '',
                senha: '',
                perfil: null  // ID do perfil selecionado
            },
            perfis: [],
            dados: null,
            erros: false,
            msg:""
        }
    },
    methods: {
    validarCamposObrigatorios() {
      

        if (!this.usuario.nome) {
            this.erros = true
             this.msg= "Nome é obrigatório." 
            throw new Error( "Nome é obrigatório.");
            
        }

        if (!this.usuario.email) {
            this.erros = true
            this.msg= "Email é obrigatório." 
            throw new Error( "Email é obrigatório." );
            
          
        }

        if (!this.usuario.senha) {
            this.erros = true
            this.msg= "Senha é obrigatória."
            throw new Error("Senha é obrigatória.");
            
           
        }

        this.token = localStorage.getItem("token");
        if (this.token !== null) {
          try {
            this.decode = jwt.decode(this.token);  // Decodifica sem verificar
            console.log("Token Decodificado:", this.decode);
            if(this.decode.status !== "ATIVO")throw new Error("Não Ativo");
            if(this.decode.perfil.nome !== "admin" && this.decode.perfil.nome !== "mast" ){
                this.erros = true
                this.msg = "Perfil não Autorizado"   
                throw new Error("Perfil não Autorizado");
            }
                     
         
        
            
          } catch (error) {
            throw new Error ("Erro ao decodificar o token:", error);
          }
        } else {
            alert("Usuário não Logado! , Faça o login e tente novamente")             
      
            this.erros = true
            this.msg = "Usuário não Logado! , Faça o login e tente novamente"   
            throw new Error("Usuário não Logado! , Faça o login e tente novamente");
        //     console.log( this.msg);
        //     throw new Error(  this.msg  )
                 
       
        }

       
    },

    async novoUsuario() {
        this.erros = null;
        this.dados = null;

        // Valida os campos obrigatórios
        const errosDeValidacao = this.validarCamposObrigatorios();
        if (errosDeValidacao) {
            this.erros = { graphQLErrors: errosDeValidacao };
           throw new Error(this.erros);
           
        }

        const userInput = {
            nome: this.usuario.nome,
            email: this.usuario.email,
            senha: this.usuario.senha,
            perfil: this.usuario.perfil,  // ID do perfil selecionado
            status: "Ativo"
        };

        try {
            const resultado = await this.$api.mutate({
                mutation: gql`
                    mutation novoUsuario($user: UsuarioInput!) {
                        novoUsuario(user: $user) {
                            id
                            nome
                            email
                            status
                            perfil {
                                id
                                rotulo
                            }
                            dataCriacao
                        }
                    }
                `,
                variables: {
                    user: userInput
                }
            }) .then(resultado => {
                this.usuarios = resultado.data.usuarios;
                this.erros = null;
                  this.dados = resultado.data.novoUsuario;

            this.usuario = {
                nome: '',
                email: '',
                senha: '',
                perfil: null
            };
     
      })
          
        } catch (errors) {
            
            this.erros = true
           const msgExtraida = errors.message.split("Erro ao criar usuário: ")[1]; 
           this.msg = msgExtraida
            console.log( this.msg );            
            throw new Error(this.erros);
        
          
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
            this.perfis = resultado.data.perfis; // Armazenando todos os perfis corretamente
        } catch (error) {       
            this.erros = true
            this.msg= "Perfil não encontrado"
            throw new Error(this.erros);
        }
    }
}

    }
</script>
