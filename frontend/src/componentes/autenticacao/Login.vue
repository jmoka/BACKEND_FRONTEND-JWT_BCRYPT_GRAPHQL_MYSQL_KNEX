<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Login</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <Erros :erros="erros" />
                    </div>
                    <v-text-field label="E-mail" v-model="usuario.email" type="email"  
                      :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail deve conter @ e um domínio']"
                    />
                    
                    <v-text-field v-if="visivel"  label="Senha" v-model="usuario.senha" type="password" />
                    <v-text-field v-else label="Senha" v-model="usuario.senha" type="text" />
                    <v-btn @click="mostrar">
                        <i class="fas fa-eye"></i> Mostrar
                      </v-btn>
                    <v-btn color="primary" class="ml-0 mt-3" @click="login">
                        Logar
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
                        <v-text-field label="E-mail" readonly v-model="dados.status" />
                        <v-text-field label="Token" readonly v-model="dados.token" />
                        <v-text-field label="Perfis" readonly v-model="dados.perfil.rotulo" />
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    components: { Erros },
    data() {
        
        return {
            visivel : true,
            usuario: {},
            dados: null,
            erros: null
        }
    },
    computed: {
        // Computed property to format the profiles into a string
        perfis() {
            return this.dados && this.dados.perfis
                ? this.dados.perfis.map(p => p.nome).join(', ')
                : 'Nenhum perfil disponível';
        }
    },
    methods: {
        mostrar(){
           this.visivel = this.visivel ? false : true
        },
        ...mapActions(['setUsuario']),
        login() {
            this.$api
                .mutate({
                    mutation: gql`
                    mutation loginUsuario($email: String!, $senha:String!) {
                        loginUsuario(dados: {
                            email: $email,
                            senha: $senha
                        }) {
                            id
                            nome
                            email
                            status                                                  
                            perfil {
                                nome
                                rotulo
                            }
                            token   
                        }
                    }`,
                    variables: {
                        email: this.usuario.email,
                        senha: this.usuario.senha,
                       
                        
                    }
                    
                })
                .then(resultado => {                    
                                                  
                     if(resultado.data.loginUsuario.status !== "ATIVO" )
                    {
                        alert("Usuário está INATIVO, entre em contato com Admin do sistema!")
                        this.usuario = {}; // Limpa os campos de login
                                          
                    }else{
                        this.dados = resultado.data.loginUsuario; // Captura os dados retornados, incluindo perfis
                        console.log("dados  --- > "+this.dados);
                        localStorage.setItem("token", this.dados.token)
                        this.usuario = {}; // Limpa os campos de login
                        this.erros = null; // Limpa os erros
                        this.setUsuario(this.dados); // Armazena os dados do usuário no Vuex
                   }
                    
                   
                })
                .catch(e=> {
                    alert("Usuário ou Senha Incorreto!, verifique e tetnte novamente!")
                    console.log(e);
                    this.usuario={}
                   
                    
                    
                });
        }
    }
}
</script>

<style></style>
