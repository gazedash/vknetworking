<template>
  <div class="root">
    <div @click="reset" class="button">
      reset

    </div>
  </div>
</template>

<script>
  export default {
    name: 'reset-button',
    methods: {
      reset() {
        this.$emit('reset')
      }
    }
  }
</script>

<style scoped>
  .root {
    position: fixed;
    left: 5px;
    bottom: 0;
    top: 101%;
  }

  .button {
    cursor: pointer;
    font-size: 12px;
    border-bottom: 1px solid #000;
  }
</style>
