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
                    <v-text-field label="E-mail" v-model="usuario.email" type="email"  
                    :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail deve conter @ e um domínio']"
                  />
                    
                    <v-text-field v-if="visivel" label="*Senha" v-model="usuario.senha" type="password" />
                    <v-text-field v-else label="*Senha" v-model="usuario.senha" type="text" />
                    <v-btn @click="mostrar">
                        <i class="fas fa-eye"></i> Mostrar
                      </v-btn>
                    
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
            msg:"",
            visivel : true
        }
    },
    methods: {
        mostrar(){
           this.visivel = this.visivel ? false : true
        },
        validarCamposObrigatorios() {
    if (!this.usuario.nome) {
        this.erros = true;
        this.msg = "Nome é obrigatório.";
        return false;
    }
    if (!this.usuario.email) {
        this.erros = true;
        this.msg = "Email é obrigatório.";
        return false;
    }
    if (!this.usuario.senha) {
        this.erros = true;
        this.msg = "Senha é obrigatória.";
        return false;
    }

    this.token = localStorage.getItem("token");
    if (this.token !== null) {
        try {
            this.decode = jwt.decode(this.token);
            if (this.decode.status !== "ATIVO") {
                this.erros = true;
                this.msg = "Usuário não está ativo.";
                return false;
            }
            if (this.decode.perfil.nome !== "admin" && this.decode.perfil.nome !== "mast") {
                this.erros = true;
                this.msg = "Perfil não autorizado.";
                return false;
            }
        } catch (error) {
            this.erros = true;
            this.msg = "Erro ao decodificar o token.";
            return false;
        }
    } else {
        this.erros = true;
        this.msg = "Usuário não logado! Faça o login e tente novamente.";
        return false;
    }
    return true;
},
verificarLogado() {
       this.token = localStorage.getItem("token");
    if (this.token !== null) {
        try {
            this.decode = jwt.decode(this.token);
            if (this.decode.status !== "ATIVO") {
                this.erros = true;
                this.msg = "Usuário não está ativo.";
                return false;
            }
            if (this.decode.perfil.nome !== "admin" && this.decode.perfil.nome !== "mast") {
                this.erros = true;
                this.msg = "Perfil não autorizado.";
                return false;
            }
        } catch (error) {
            this.erros = true;
            this.msg = "Erro ao decodificar o token.";
            return false;
        }
    } else {
        this.erros = true;
        alert("Usuário não logado! Faça o login e tente novamente.")
        this.msg = "Usuário não logado! Faça o login e tente novamente.";
        return false;
    }
    return true;
},
async novoUsuario() {
    this.erros = false;
    this.dados = null;

    if (!this.validarCamposObrigatorios()) {
        return;
    }

    const userInput = {
        nome: this.usuario.nome,
        email: this.usuario.email,
        senha: this.usuario.senha,
        perfil: this.usuario.perfil,
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
        });

        this.dados = resultado.data.novoUsuario;
        this.usuario = {
            nome: '',
            email: '',
            senha: '',
            perfil: null
        };

    } catch (error) {
        this.erros = true;
        this.msg = error.message;
    }
}
,

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
            
    if (!this.verificarLogado()) {
        return;
    }
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
