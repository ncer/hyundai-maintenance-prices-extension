import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import store from '../store'

Vue.use(Vuex)

const app = document.createElement('div')
app.id = 'hmpeContentApp'
document.body.prepend(app)

/* eslint-disable no-new */
new Vue({
  el: '#hmpeContentApp',
  store,
  render: (h) => h(App),
})
