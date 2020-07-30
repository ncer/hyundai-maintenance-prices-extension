import Vue from 'vue'
import store from './store'
import Vuex from 'vuex'
Vue.use(Vuex)

global.browser = require('webextension-polyfill')

browser.browserAction.onClicked.addListener(function(tab) {
  browser.tabs.executeScript(tab.id, {
    file: 'content.js',
  })
})
