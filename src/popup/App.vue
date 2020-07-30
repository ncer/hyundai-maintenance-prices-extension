<template>
  <div>
    <Link href="https://www.hyundai.ru/" type="primary">На сайт Hyundai</Link>
    <br /><br />
    <Button type="primary" @click="onClick">{{ buttonText }}</Button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Link, Button } from 'element-ui'

export default {
  name: 'HMPEPopupApp',

  data() {
    return {}
  },

  components: {
    Link,
    Button,
  },

  computed: {
    ...mapState(['isPopupVisible']),

    buttonText() {
      return this.isPopupVisible ? 'Закрыть форму' : 'Открыть форму'
    },
  },

  mounted() {},

  methods: {
    ...mapMutations(['SET_POPUP_VISIBILITY']),

    onClick() {
      this.SET_POPUP_VISIBILITY((this.isPopupVisible = !this.isPopupVisible))
    },
  },
}
</script>

<style lang="scss" scoped></style>
