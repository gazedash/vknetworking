<template>
  <div class="el">
    <div>
      <a :href="'https://vk.com/id' + profile.uid">
        <img :src="profile.photo_max"/>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    text-decoration: none;
    color: black;
  }
  .name {
    padding: 7px 0 8px 0;
    text-align: center;
  }

  .el {
    box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.15), 0 7px 12px 0 rgba(0, 0, 0, 0.15);
    display: inline-block;
    /*border-radius: 2px;*/
    background-color: #fafafa;
    margin: 10px;
  }
</style>
