import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'

import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPopupVisible: false,
  },
  getters,
  mutations,
  actions,
  plugins: [VuexWebExtensions()],
})
