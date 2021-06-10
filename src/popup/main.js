import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import store from '../store'

Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
})
