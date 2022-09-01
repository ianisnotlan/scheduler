<template>
  <div class="logo" @click="goHome">EmptyScheduler</div>
</template>

<script>
import { tracker } from '../utils'

export default {
  name: 'Anchor',
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' })
      tracker('clickAnchor')
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  font-size: 20px;
  position: absolute;
  cursor: pointer;
}
</style>
