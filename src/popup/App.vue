<template>
  <div class="popup">
    <Logo />
    <Link href="https://www.hyundai.ru/service/maintenance#app" target="_blank" type="primary">
      На сайт Hyundai
      <i class="el-icon-top-right el-icon--right" />
    </Link>
    <br />
    <Button type="primary" @click="onClick">{{ buttonText }}</Button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Link, Button } from 'element-ui'
import Logo from '@/components/Logo.vue'

export default {
  name: 'PopupApp',

  components: {
    Button,
    Link,
    Logo,
  },

  computed: {
    ...mapState(['isDialogVisible']),

    buttonText() {
      return this.isDialogVisible ? 'Закрыть форму' : 'Открыть форму'
    },
  },

  methods: {
    ...mapMutations(['SET_DIALOG_VISIBILITY']),

    onClick() {
      if (this.isDialogVisible) {
        this.SET_DIALOG_VISIBILITY(false)
      } else {
        this.SET_DIALOG_VISIBILITY(true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  padding: 16px;
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background: 0;
}
</style>
