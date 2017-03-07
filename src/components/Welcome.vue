<template>
  <div class="welcome">
    <div class="text">
      This application finds people in all groups that<br> specified profile is subscribed to
      and filters<br>
      them by criteria that you specify.
    </div>
    <mu-flat-button @click="doNotShowAgain" backgroundColor="rgba(255,255,255,0.2)" color="white">OK</mu-flat-button>
  </div>
</template>

<script>
  export default {
      name: 'welcome',
      methods: {
          doNotShowAgain() {
              this.$emit('doNotShowAgain')
          }
      }
  }
</script>

<style scoped>
  .welcome {
    position: absolute;
    color: #fff;
    left: -100%;
    z-index: 3;
  }
</style>
