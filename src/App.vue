<template>
  <div id="app">
    <search></search>
    <router-view></router-view>
  </div>
</template>

<script>
  import Search from './components/Search';
  export default {
    name: 'app',
    components: {
        Search,
    }
  };
</script>

<style>
</style>
