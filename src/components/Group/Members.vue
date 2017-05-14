<template>
  <div class="">
    <div class="members">
      <friend class="link" :key="friend" v-for="friend in item" :item="friend"></friend>
    </div>
  </div>
</template>

<script>
  import Friend from './Friend.vue';

  export default {
    name: 'members',
    components: {
      Friend,
    },
    props: {
      item: { type: Array, required: true },
    },
  };
</script>

<style scoped>
  .members {
    display: flex;
    flex-wrap: wrap;
  }
</style>
