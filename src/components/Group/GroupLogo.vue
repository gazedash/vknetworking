<template>
  <a class="link logo"
     :href="publicLink"
     target="_blank">
    <img class="group-icon" v-lazy="groupPhoto"/>
    <svg v-if="isMember" style="width:24px;height:24px" viewBox="0 0 24 24">
      <path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
    </svg>
    <div class="title">{{ groupName }}</div>
  </a>
</template>

<script>
  export default {
    name: 'group-logo',
    props: {
      item: { type: Object, required: true },
    },
    computed: {
      publicLink() {
        return `https://vk.com/public${this.item.gid}`;
      },
      groupPhoto() {
        return this.item.photo;
      },
      groupName() {
        return this.item.name;
      },
      isMember() {
        return this.item.is_member;
      },
    },
  };
</script>

<style scoped>
  .title {
    color: #000;
    word-break: keep-all;
    width: 225px;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 10px;
  }

  .group-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .logo {
    align-self: flex-start;
  }
</style>
