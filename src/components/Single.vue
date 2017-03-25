<template>
  <div class="root">
    <a class="link logo"
       :href="'https://vk.com/id' + user.uid"
       target="_blank">
      <img class="image" v-lazy="user.photo_50"/>
      <div class="title">{{ user.first_name }} {{ user.last_name }}</div>
    </a>
    <div class="members">
      <a class="link" v-for="group in groups"
         :href="'https://vk.com/public' + group.info.gid"
         target="_blank">
        <img :title="group.info.name" class="group-icon" v-lazy="group.info.photo"/>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'single',
    props: {
      item: { type: Object, required: true },
    },
    computed: {
      user() {
        return this.item.user;
      },
      groups () {
        return this.item.groups;
      },
    },
    methods: {
      returnPhoto (friend) {
        return friend.photo_50;
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

  .members {
    display: flex;
    flex-wrap: wrap;
  }

  .root {
    border-top: solid 1px #e7e8ec;
    padding: 10px;
    display: flex;
  }

  .group-icon {
    /*border-radius: 50%;*/
    width: 46px;
    height: 46px;
    margin-right: 5px;
    /*0*/
    /*display: flex;*/
    /*justify-content: center;*/
  }

  .logo {
    align-self: flex-start;
  }

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
