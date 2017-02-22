<template>
  <div class="el">
    <div>
      <a :href="'https://vk.com/id' + profile.uid" target="_blank">
        <div class="image">
          <img :src="profile.photo_max"/>
        </div>
        <div class="name">{{ profile.first_name }} {{ profile.last_name }}</div>
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
        msg: 'Welcome to Your Vue.js App'
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
    display: flex;
    justify-content: center;
  }
  .name {
    overflow: hidden;
    padding: 8px 0 8px 0;
    text-align: center;
  }
  .el {
    box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.1), 0 7px 12px 0 rgba(0, 0, 0, 0.10);
    display: inline-flex;
    /*border-radius: 2px;*/
    background-color: #fafafa;
    margin: 10px;
  }
</style>
