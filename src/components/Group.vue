<template>
  <div class="root">
    <a class="link logo"
       :href="'https://vk.com/public' + item.info.gid"
       target="_blank">
      <img class="group-icon" v-lazy="item.info.photo"/>
      <svg v-if="item.info.is_member" style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
      </svg>
      <div class="title">{{ item.info.name }}</div>
    </a>
    <div class="members">
      <a class="link" v-for="friend in item.data"
         :href="'https://vk.com/id' + friend.uid"
         target="_blank">
        <img class="image" :title="friend.first_name + ' ' + friend.last_name" v-lazy="returnPhoto(friend)"/>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'group',
    props: {
      item: { type: Object, required: true },
    },
    data () {
      return {
//        activeId: null,
      };
    },
    methods: {
//      open() {
//        this.$emit('open', this.item.uid)
//      },
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
    border-radius: 50%;
    margin-right: 10px;
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
