// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        usuario: null,
    },
    getters: {
        usuario: state => state.usuario,
    },
    mutations: {
        SET_USUARIO(state, usuario) {
            state.usuario = usuario;
        },
    },
    actions: {
        setUsuario({ commit }, usuario) {
            
            commit('SET_USUARIO', usuario);
        },
        login({ commit }, usuario) {
            // Simular um login e definir o usuário
            commit('SET_USUARIO', usuario); // Aqui você pode pegar o usuário do backend
        },
        logout({ commit }) {
            commit('SET_USUARIO', null);
        },
    },
});
