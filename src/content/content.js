import Vue from 'vue'
import App from './App'
import store from '../store'
import Vuex from 'vuex'

Vue.use(Vuex)

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

const app = document.createElement('div')
app.id = 'hmpeContentApp'
document.body.prepend(app)

/* eslint-disable no-new */
new Vue({
  el: '#hmpeContentApp',
  store,

  render: h => h(App),
})
