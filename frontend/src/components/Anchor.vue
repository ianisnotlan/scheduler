<template>
  <div class="logo" @click="goHome">EmptyScheduler</div>
</template>

<script>
export default {
  name: 'Anchor',
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' })
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
