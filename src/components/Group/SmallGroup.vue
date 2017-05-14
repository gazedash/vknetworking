<template>
  <a class="link"
     :href="link"
     target="_blank">
    <img :title="name" class="image" v-lazy="photo"/>
  </a>
</template>

<script>
  export default {
    name: 'small-group',
    props: {
      item: { type: Object, required: true },
    },
    computed: {
      name() {
        return `${this.item.first_name} ${this.item.name}`;
      },
      link() {
        return `https://vk.com/public${this.item.gid}`;
      },
      photo() {
        return this.item.photo;
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
