<template>
  <div id="shell">
    <search-header></search-header>
    <profile-list :size="size" :list="list"></profile-list>
  </div>
</template>

<script>
  import SearchHeader from './SearchHeader'
  import ProfileList from './ProfileList'
  import {checkFirstTimeAndSet} from "../utils/auth";

  export default {
    name: 'shell',
    computed: {
      list () {
        return this.$store.getters.getProfileList
      },
      size () {
        return this.$store.state.fetchedCommunitiesLength
      },
    },
    components: {
      SearchHeader, ProfileList
    },
  }
</script>

<style>
  #shell {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
