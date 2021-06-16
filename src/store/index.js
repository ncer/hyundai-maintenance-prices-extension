import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDialogVisible: false,
  },
  mutations: {
    SET_DIALOG_VISIBILITY(state, payload) {
      state.isDialogVisible = payload
    },
  },
  plugins: [VuexWebExtensions()],
})
