<template>
  <div>
    <mu-appbar class="app-bar">
      <div slot="left">
        <slot name="left"></slot>
      </div>
      <div slot="left" class="home">
        <router-link to="/">VKNetworking</router-link>
      </div>
      <div slot="right">
        <slot name="right"></slot>
      </div>
    </mu-appbar>
  </div>
</template>

<script>
export default {
    name: 'app-header',
}
</script>

<style scoped>
  .app-bar {
    z-index: 2;
  }
  .home {
    text-align: center;
  }
  .home > a {
    color: #fff;
  }
</style>
