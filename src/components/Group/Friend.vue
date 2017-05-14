<template>
  <a class="link"
     :href="link"
     target="_blank">
    <img class="image" :title="name" v-lazy="photo"/>
  </a>
</template>

<script>
  export default {
    name: 'friend',
    props: {
      item: { type: Object, required: true },
    },
    computed: {
      name() {
        return `${this.item.first_name} ${this.item.last_name}`
      },
      link() {
        return `https://vk.com/id${this.item.uid}`;
      },
      photo() {
        return this.item.photo_50;
      },
    },
  };
</script>

<style scoped>
  .image {
    padding: 3px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    z-index: 0;
    display: flex;
    justify-content: center;
  }
</style>
