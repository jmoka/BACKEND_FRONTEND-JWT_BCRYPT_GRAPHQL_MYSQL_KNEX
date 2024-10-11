<template>
    <v-card v-if="usuario" class="ma-3 pa-2">
        <v-layout fill-height align-center>
            <v-flex>
                <span class="ml-3 headline"><strong>Nome: </strong></span>
                <span class="headline blue--text text--darken-2">
                    {{ usuario.nome }}</span>

                <span class="ml-3 headline"><strong>Email: </strong></span>
                <span class="headline blue--text text--darken-2">
                    {{ usuario.email }}</span>

                <span class="ml-3 headline"><strong>Perfis: </strong></span>
                <span class="headline red--text text--darken-2">
                    {{ perfis }}</span>
            </v-flex>
            <v-flex>
            </v-flex>
            <v-flex shrink>
                <v-btn color="error" @click="setUsuario(null)">
                    Sair
                </v-btn>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters(['usuario']), // Acessa o estado do usuário no Vuex
        perfis() {
            // Verificação e log para verificar a estrutura do usuário
            console.log('Usuario:', this.usuario.perfil);

            if (!this.usuario || !this.usuario.perfil) {
                console.warn('Perfil não disponível'); // Log se o perfil não estiver disponível
                return 'Nenhum perfil disponível'; // Retorna mensagem padrão se não houver perfil
            }

            // Se perfil for um objeto, retorna o nome do perfil
            return this.usuario.perfil.nome || 'Perfil sem nome'; // Adapta para o caso do objeto
        }
    },
    methods: {
        ...mapActions(['setUsuario']), // Ação para deslogar o usuário
    }
}
</script>
