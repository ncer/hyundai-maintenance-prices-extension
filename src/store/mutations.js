import * as types from './mutation-types'

export default {
  [types.SET_POPUP_VISIBILITY](state, payload) {
    state.isPopupVisible = payload
  },
}
