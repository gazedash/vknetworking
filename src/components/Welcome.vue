<template>
  <div class="welcome">
    <div class="text">
      This application finds people in all groups that specified profile is subscribed to
      and filters them by criteria that you specify.
    </div>
    <mu-flat-button @click="doNotShowAgain" class="button" backgroundColor="rgba(255,255,255,0.2)" color="white">OK</mu-flat-button>
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
    max-width: 310px;
    z-index: 3;
  }

  @media screen and  (max-width: 1000px) {
    .button {
      color: #000 !important;
    }
    .welcome {
      color: #000;
      position: relative;
      left: 0;
    }
  }
</style>
