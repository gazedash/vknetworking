<template>
  <mu-popup :position="position" popupClass="mypopup" :open="open" @close="closeInner">
    <slot></slot>
  </mu-popup>
</template>

<script>
export default {
    name: 'my-popup',
    props: ['open', 'position'],
    methods: {
       closeInner() {
         this.$emit('close');
       }
    }
}
</script>

<style>
  .mypopup {
    width: 100%;
    max-width: 310px;
  }
</style>
