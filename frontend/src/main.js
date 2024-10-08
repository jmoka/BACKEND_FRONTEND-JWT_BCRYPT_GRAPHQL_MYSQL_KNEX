import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import apolloProvider from './plugins/graphql'



Vue.config.productionTip = false

new Vue({

  apolloProvider,
  store,
  render: h => h(App)
}).$mount('#app')
