<template>
  <div class="el">
    <div>
      <a v-on:mouseenter="mouseOver(profile.uid)" v-on:mouseleave="mouseLeave" :href="'https://vk.com/id' + profile.uid" target="_blank">
        <div class="image">
          <img :src="profile.photo_max"/>
          <div v-if="activeId === profile.uid" class="name">
            {{ profile.first_name }} {{ profile.last_name }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'person',
    props: ['profile'],
    data () {
      return {
        activeId: null,
        msg: 'Welcome to Your Vue.js App'
      }
    },
    created() {
      if (this.profile && !this.profile.photo_max) {
          console.log('no photo?', this.profile);
      }
    },
    methods: {
      mouseOver(id) {
        this.activeId = id;
      },
      mouseLeave() {
        this.activeId = null;
      }
    }
  }
</script>

<style scoped>
  img {
    height: 200px;
    width: 200px;
  }
  a {
    display: block;
    text-decoration: none;
    color: black;
  }
  .image {
    z-index: 0;
    display: flex;
    justify-content: center;
  }
  .name {
    background-color: rgba(0,0,0,0.25);
    color: #fff;
    position: absolute;
    margin-top: 12.1em;
    z-index: 1;
    width: 200px;
    overflow: hidden;
    padding: 5px 0 5px 0;
    text-align: center;
  }
  @media screen and (min-width: 1220px) {
    img {
      height: 240px;
      width: 240px;
    }
    .name {
      margin-top: 14.9em;
      width: 240px;
    }
  }
  @media screen and (min-width: 1440px) {
    img {
      height: 260px;
      width: 260px;
    }
    .name {
      margin-top: 16.35em;
      width: 260px;
    }
  }
  @media screen and (min-width: 1570px) {
    img {
      height: 280px;
      width: 280px;
    }
    .name {
      margin-top: 17.8em;
      width: 280px;
    }
  }
  .el {
    /*box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.1), 0 7px 12px 0 rgba(0, 0, 0, 0.10);*/
    background-color: #fafafa;
  }
</style>
