<template>
  <div id="hpe-content-app" class="hpe-content-app">
    <Dialog title="Tips" :visible="isPopupVisible" width="80vw" @close="onPopupClick">
      {{ params }}
    </Dialog>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import { Dialog, Button } from 'element-ui'

export default {
  name: 'HPEContentApp',

  components: {
    Dialog,
    Button,
  },

  data: () => ({
    params: [],
  }),

  computed: {
    ...mapState(['isPopupVisible', 'selectList']),
  },

  beforeDestroy() {
    window.removeEventListener('load', this.onLoad)
    this.getContainer().removeEventListener('click', this.onContainerClick)
  },

  async mounted() {
    // this.params = await axios.get('https://www.hyundai.ru/ajax/new/getServiceJSON')

    window.addEventListener('load', this.onLoad)
  },

  methods: {
    ...mapMutations(['SET_POPUP_VISIBILITY']),

    onPopupClick() {
      this.SET_POPUP_VISIBILITY((this.isPopupVisible = !this.isPopupVisible))
    },

    onContainerClick(e) {
      console.log('___ click', e)
      if (e.target.className.includes('selectize-input')) {
        console.log('___ selectize-input', e.target.closest('.selectize-control'))
        // console.log('___ selectize-input 2', document.querySelector('.selectize-dropdown'))
        e.target.closest('.selectize-control').addEventListener('click', this.onDropdownClick)
      }
      this.setParams()
    },

    onDropdownClick(e) {
      console.log('___ dropdown click', e)
    },

    getContainer() {
      return document.getElementById('servicecalculator')
    },

    getSelects() {
      const allSelects = this.getContainer().querySelectorAll('.df-select')
      return (
        Array.from(allSelects)
          // .filter((item, idx) => idx <= 2)
          .map(item => {
            const el = item.querySelector('.item[data-value]')
            if (el) {
              return el.dataset.value
            }
          })
      )
    },

    getEngine() {
      return this.getContainer().querySelector('.v-engine__item.active .v-engine__link').innerText
    },

    getMileage() {
      return this.getContainer()
        .querySelector('.df-range [aria-valuenow]')
        .getAttribute('aria-valuenow')
    },

    getDealers() {},

    setParams() {
      this.params.car = this.getSelects()[0]
      this.params.year = this.getSelects()[1]
      this.params.engineType = this.getSelects()[2]
      this.params.engine = this.getEngine()
      this.params.mileage = this.getMileage()

      // console.log('___ selects', this.getSelects())
      console.log('___ params', this.params)
    },

    onLoad() {
      console.log('___ load')
      this.setParams()

      this.getContainer().addEventListener('click', this.onContainerClick)
      // document.querySelector('.selectize-control').addEventListener('click', this.onDropdownClick)
    },
  },
}
</script>

<style scoped>
#hpe-content-app {
  /*position: fixed;*/
  /*top: 10px;*/
  /*left: 10px;*/
  /*width: 150px;*/
  /*height: 100px;*/
  /*z-index: 999999999;*/
}
</style>
