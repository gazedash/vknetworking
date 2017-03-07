<template>
  <div>
    <mu-appbar class="app-bar" :zDepth="1">
      <div class="home">
        <router-link to="/">VKNetworking</router-link>
      </div>
      <div slot="left">
        <slot name="left"></slot>
      </div>
      <div slot="right">
        <slot name="right"></slot>
      </div>
    </mu-appbar>
    <slot name="popup"></slot>
  </div>
</template>

<script>
export default {
    name: 'app-header',
}
</script>

<style scoped>
  .home {
    text-align: center;
  }
  .home > a {
    color: #fff;
  }
  .app-bar {
    position: fixed;
    top: 0;
  }
</style>
